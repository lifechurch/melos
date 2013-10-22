module YV
  module API
    module Mapper
      class PlanCategory < Base

        class << self

          private


            def from_find(instance,results)
              pc = instance
              root = results.categories

              # Populate current data
              if current = root.current
                pc.slug = current.category 
                pc.label = current.labels["default"]  #TODO localize
              end

              # Populate breadcrumbs
              if bcs = root.breadcrumbs
                crumbs = bcs.collect do |bc_data|
                  p = ::PlanCategory.new
                  p.slug = bc_data.category
                  p.label = bc_data.labels["default"] #TODO localize
                  p
                end
                pc.breadcrumbs = crumbs
              end

              # Populate parent data
              if parent_data = root.parent
                parent = ::PlanCategory.new
                parent.slug = parent_data.category
                pc.parent = parent
              end

              # Populate children data
              if children = root.children
                childs = children.collect do |child|
                  p = ::PlanCategory.new
                  p.slug  = child.category
                  p.label = child.labels["default"] #TODO localize
                  p
                end
                pc.children = childs
              end

              return pc
            end

        end
        
      end
    end
  end
end