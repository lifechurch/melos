  require 'forwardable'
class ReferenceList
  include Enumerable
  extend Forwardable
  def_delegators :@references, :each

  attr_accessor :total, :version

  def method_missing(method, *args, &block)
    # puts "In #{self.class}.method_missing, Caller is #{caller.first}, method is #{method}"
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
  def <<(*args)
    @references.concat args.map{|r| Reference.new(r.to_osis_string, self.version)}
  end

  def initialize(args, version = nil)
    self.version = version
    @references = []

    case args
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
          Reference.new(ref.osis.downcase, self.version)
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

  # Present our References in a string format suitable for sending to the API,
  # ever-cognizant of the API version's requirements.
  def to_api_string
    join_str = case Cfg.api_version
    when "2.3"
      '%2b'
    when "2.4"
      ','
    else
      '%2b'
    end
    @references.compact.map(&:osis_noversion).join(join_str)
  end
end
