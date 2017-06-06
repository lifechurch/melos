collection @friendships.incoming, root: "incoming"
attributes :id, :name, :username
node :avatars do |incoming|
  incoming.avatars
end

# {
#    "incoming":[
#       {
#          "id":7474,
#          "name":"Bryan Test",
#          "username":"bdmtest",
#          "avatars":{
#             "collection":[
#                {
#                   "url":"//d1c1qrnexsp66u.cloudfront.net/users/images/437d4b36444fafd199b10587b0e39dbd_24x24.png",
#                   "height":24,
#                   "width":24
#                },
#                {
#                   "url":"//d1c1qrnexsp66u.cloudfront.net/users/images/437d4b36444fafd199b10587b0e39dbd_48x48.png",
#                   "height":48,
#                   "width":48
#                },
#                {
#                   "url":"//d1c1qrnexsp66u.cloudfront.net/users/images/437d4b36444fafd199b10587b0e39dbd_128x128.png",
#                   "height":128,
#                   "width":128
#                },
#                {
#                   "url":"//d1c1qrnexsp66u.cloudfront.net/users/images/437d4b36444fafd199b10587b0e39dbd_512x512.png",
#                   "height":512,
#                   "width":512
#                }
#             ],
#             "action_url":"//www.bible.com/users/7474",
#             "style":"circle"
#          }
#       }
#    ]
# }