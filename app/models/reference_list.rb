require 'forwardable'
class ReferenceList
  include Enumerable
  extend Forwardable
  def_delegators :@references, :each

  def method_missing(method, *args, &block)
    result = @references.send(method, *args, &block)
    if result.is_a? Array
      ReferenceList.new(result)
    else
      result
    end
  end

  def <<(*args)
    args.map do |r|
      raise "Reference Lists can only consist of Reference Objects" if r.class != Reference

      @references << Reference.new(r.to_param)
    end
  end

  def initialize(refs = nil, version = nil)
    # if there is an explicit version, we will override the version
    # when creating the references
    force_ref_opts = version.present? ? {version: version} : {}
    @references = []

    case refs
    when nil
    when Array
      @references = refs.map do |ref|
        case ref
        when Reference
          ref
        when String
          Reference.new(ref, force_ref_opts)
        when Hashie::Mash
          if ref.respond_to? :osis
            split_multi_ref_string(ref.osis).map{|ref| Reference.new(ref, force_ref_opts)}
          elsif ref.respond_to? :usfm
            split_multi_ref_string(ref.usfm).map{|ref| Reference.new(ref, force_ref_opts)}
          end
        end
      end
    when String
      @references = split_multi_ref_string(refs).map{|ref| Reference.new(ref, force_ref_opts)}
    when Hashie::Mash
      if refs.respond_to? :osis
        @references = split_multi_ref_string(refs.osis).map{|ref| Reference.new(ref, force_ref_opts)}
      elsif refs.respond_to? :usfm
        @references = split_multi_ref_string(refs.usfm).map{|ref| Reference.new(ref, force_ref_opts)}
      end
    end
    @references.flatten!
  end

  def to_api_string
    join_str = '+'
    refs = @references.compact.map do |r|
      usfm = r.to_usfm
      if numbered_book_splits = usfm.match(/(^\d)(\D{1})(.+)/)
        usfm = "#{numbered_book_splits[1]}#{numbered_book_splits[2].upcase}#{numbered_book_splits[3]}"
      else
        usfm = usfm.capitalize
      end
      usfm.upcase
    end

    refs.join(join_str)
  end

  def valid?
    @references.select {|r| r.valid?}.length == length
  end

  #TODO: why aren't the remaining methods private (or non existent for smash_verses)?

  def split_multi_ref_string(ref_string)
    ref_array = case ref_string
    when /([\+\,])/  # if this case matches, either '+' or ',' will be stored in $1
      ref_string.split($1)
    else
      [ref_string]
    end
  end

	def smash_verses(refs)
		refs = refs.sort_by { |i| i.to_usfm }
	end
end
