# TODO: This will eventually need to be fleshed out and mixin Enumerable
# instead of hijacking Array. But simplest thing that works, yeah?

class ResourceList < Array
  attr_accessor :page, :total
  def initialize(*args)
    super(*args)
    # Get a default page value
    @page = 1
    # Default to same as #size
    @total = self.count
  end
end
