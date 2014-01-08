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

            # Populate parent data
            if parent_data = root.parent
              parent = ::PlanCategory.new
              parent.slug = parent_data.category
              pc.parent = parent
            end

            # Populate breadcrumbs
            if root.breadcrumbs
              pc.breadcrumbs = to_plan_categories(root.breadcrumbs)
            end

            # Populate children data
            if root.children
              pc.children = to_plan_categories(root.children)
            end

            return pc
          end

          def to_plan_categories(children)
            children.collect do |data|
              p = ::PlanCategory.new
              p.slug = data.category
              p.label = data.labels["default"] #TODO localize
              p
            end
          end

        end
      end
    end
  end
end