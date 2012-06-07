module UsersSpecHelper
  def filtered_all_by_language(opts={})
     all_by_lang = Version.all_by_language.delete_if{|k,v| !(opts[:languages].include? k)}
     opts[:languages].each do |lang|
       all_by_lang[lang].delete_if{|k,v| !(opts[:versions].include? k)}
     end
     all_by_lang
  end
end
