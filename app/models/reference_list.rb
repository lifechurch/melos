  require 'forwardable'
class ReferenceList
  include Enumerable
  extend Forwardable
  def_delegators :@references, :each

  attr_accessor :total, :version

  def method_missing(method, *args, &block)
    result = @references.send(method, *args, &block)
    if result.is_a? Array
      ReferenceList.new(result)
    else
      result
    end
  end

  # TODO: Fairly brittle - probably only going to work as written
  # with just osis-able strings. Do we need << for this class?
  # Probably not.
  # Yes, we do (EP), see Subscriptions:set_ref_completion
  def <<(*args)
    args.map do |r| 
      raise "Reference Lists can only consist of Reference Objects" if r.class != Reference
      
      @references << Reference.new(r.osis, self.version)
    end
  end

  def initialize(args = nil, version = nil)
    self.version = version
    @references = []

    case args
    when nil
    when Array
      # TODO: This needs to be more robust. In my limited experience so far, these
      # arrays that arrive here are made up of scripture strings, meaning they don't
      # have an .osis method.

      # TODO: Refactor this and push most of it down into Reference. Eek, this is
      # getting ugly.
      @references = args.map do |ref|
        case ref
        when Reference
          ref
        when String
          Reference.new(ref.to_osis_string.downcase, self.version)
        when Hashie::Mash
          Reference.new(ref, self.version)
        end
      end
    when String
      @references = split_multi_ref_string(args.downcase)
    when Hashie::Mash
      @references = split_multi_ref_string(args.osis.downcase)
    end
    # Default to same as #size
    @total = self.count
  end

  def split_multi_ref_string(ref_string)
    ref_array = case ref_string
    when /([\+\,])/  # if this case matches, either '+' or ',' will be stored in $1
      ref_string.split($1)
    else
      # just stick the string in a single-element array so we only need to
      # maintain one create-the-References line at the end
      [ref_string]
    end
    ref_array.map{|str| Reference.new(str.strip, self.version)}
  end

  def to_api_string
    join_str = '+'
    
    @references.compact.map{|r| r.osis_noversion.capitalize}.join(join_str)
  end
end
