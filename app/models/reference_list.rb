require 'forwardable'
class ReferenceList
  include Enumerable
  extend Forwardable
  def_delegators :@references, :<<, :each, :concat

  attr_accessor :page, :total, :version

  def method_missing(method, *args, &block)
    puts "Caller is #{caller.first}"
    result = @references.send(method, *args, &block)
    if result.is_a? Array
      ReferenceList.new(*result)
    else
      result
    end
  end

  def initialize(args, version = nil)
    puts "In initialize(#{args}  xxx  #{version})"
    self.version = version
    @references = []

    case args
    when Array
      @references = args.map { |r| Reference.new("#{r.osis.downcase}.#{self.version}") }
      @reference = args.map { |r| Reference.new("#{r.osis.downcase}.#{self.version}") }
    when String
      @references = [Reference.new("#{args.downcase}.#{self.version}")]
    when Hashie::Mash
      @references = [Reference.new("#{args.osis.downcase}.#{self.version}")]
    end

    # Get a default page value
    @page = 1
    # Default to same as #size
    @total = self.count
  end

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
