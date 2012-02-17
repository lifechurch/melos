yml = YAML.load_file(File.expand_path("../../authorize_net.yml", __FILE__))
AUTHORIZE_NET_CONFIG = yml['default']
AUTHORIZE_NET_CONFIG.merge!(yml[Rails.env]) unless yml[Rails.env].nil?
AUTHORIZE_NET_CONFIG.freeze
