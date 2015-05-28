module YV
  module API
    module Mapper
      class Trending < Base

        class << self

          def from_all(results)
            return results if results.empty?
            results.collect do |ref|
              verse = Reference.new(ref.try(:to_param), version: Version.default_for(I18n.locale.to_s))
              verse
            end
          end

        end

      end
    end
  end
end