object @reference

node(:error){|ref| 'Reference not found.'}
node(:reference){|ref| ref.to_s}
node(:version){|ref| (ref.version || @version).to_s}
node(:version_id){|ref| (ref.version || @version).try :id}
