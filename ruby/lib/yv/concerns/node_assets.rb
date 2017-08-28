  module YV
  module Concerns
    module NodeAssets
      def add_node_assets(assets)
        assetsToLoad = []
        if !@node_assets.present?
          @node_assets = []
        end

        assets.each do |s|
          if !@node_assets.include? s
            @node_assets.push(s)
            assetsToLoad.push(s)
          end
        end

        return assetsToLoad
      end
    end
  end
end
