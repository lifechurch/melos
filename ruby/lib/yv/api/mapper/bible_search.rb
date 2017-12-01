module YV
  module API
    module Mapper
      class BibleSearch < Base

        class << self

          private

          def from_search(results)
            # raise 'the roof'
            unless results.blank? || results.errors?
              verses = results.verses.collect do |verse|
                s = Search::Bible.new
                ref = verse.reference
                s.human = ref.human
                s.usfm  = ref.usfm
                s.version_id = ref.version_id
                s.version_local_abbreviation = verse.version.local_abbreviation
                s.content = verse.content
                s.highlight = verse.highlight
                s
              end
              YV::API::Results.new(verses)
            end

          end
        end
      end
    end
  end
end