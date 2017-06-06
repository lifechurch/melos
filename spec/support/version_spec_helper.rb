module UsersSpecHelper
  def filtered_all_by_language(opts={})
     all_by_lang = Version.all_by_language.delete_if{|lang,versions| !(opts[:languages].include? lang)}
     opts[:languages].each do |lang|
       all_by_lang[lang].delete_if{|version| !(opts[:versions].include? version.id)}
     end
     all_by_lang
  end
end
