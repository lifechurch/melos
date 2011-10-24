module ApplicationHelper
  
  def object_status   #TODO: More useful name?
    status = {}
    status['Public'] = 'public'
    status['Private'] = 'private'
    status['Draft'] = 'draft'
    status
  end
  
end
