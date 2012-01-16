# TODO: This will eventually need to be fleshed out and mixin Enumerable
# instead of hijacking Array. But simplest thing that works, yeah?

class ResourceList < Array
  attr_accessor :page, :total, :page_length
  def initialize(*args)
    super(*args)
    # Get a default page value
    @page = 1
    @page_length = 25
    # Default to same as #size
    @total = self.count
  end

  def total_pages
    (total.to_f/page_length).ceil
  end

  def has_pages
    total_pages > 1
  end
  
  def count
    total
  end
  
end
