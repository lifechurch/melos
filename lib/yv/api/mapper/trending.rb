# module YV
#   module API
#     module Mapper
#       class Trending < Base
#
#         class << self
#
#           def from_all(results)
#             results.map do |ref|
#                Reference.new(ref)
#             end
#           end
#
#         end
#
#       end
#     end
#   end
# end