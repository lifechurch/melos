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
      raise "Reference Lists can only consist of Reference Objects" unless r.is_a? Reference

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
            @references = split_multi_ref_string(ref.to_param).map{|ref| Reference.new(ref, force_ref_opts)}
          elsif ref.respond_to? :usfm
            @references = split_multi_ref_string(ref.usfm).map{|ref| Reference.new(ref, force_ref_opts)}
          end
        end
      end
    when String
      @references = split_multi_ref_string(refs).map{|ref| Reference.new(ref, force_ref_opts)}
    when Hashie::Mash
      if refs.respond_to? :usfm
        @references = split_multi_ref_string(refs.usfm).map{|ref| Reference.new(ref, force_ref_opts)}
      end
    end
    @references.flatten!
  end

  def to_usfm
    # The API requires multiple references to be
    # referenced as arrays of + separated verses.
    @references.compact.map{|r| r.to_usfm}
  end
  
  def to_flat_usfm
    @references.compact.map{|r| r.to_usfm}.join("+")
  end

  def valid?
    @references.select {|r| r.valid?}.length == length
  end

  private

  def split_multi_ref_string(ref_string)
    ref_array = case ref_string
    when /([\+\,])/  # if this case matches, either '+' or ',' will be stored in $1
      ref_string.split($1)
    else
      [ref_string]
    end
  end

end
