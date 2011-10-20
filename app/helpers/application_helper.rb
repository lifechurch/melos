module ApplicationHelper
  
  def object_status   #TODO: More useful name?
    status = {}
    status['Public'] = 0
    status['Private'] = 1
    status['Draft'] = 2
    status
  end
  
end
