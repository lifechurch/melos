# More info at https://github.com/guard/guard#readme
guard :rspec, cmd: 'zeus rspec', failed_mode: :focus do
  watch(%r{^spec/.+_spec\.rb$})
  watch('spec/spec_helper.rb')                        { "spec" }
  watch(%r{^spec/support/(.+)\.rb$})                  { "spec/" }
  watch('config/routes.rb')                           { "spec/routing" }
  watch('app/controllers/application_controller.rb')  { "spec/controllers" }  
  watch(%r{^app/(.+)\.rb$})                           { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^app/(.*)(\.erb|\.haml|\.slim)$})          { |m| "spec/#{m[1]}#{m[2]}_spec.rb" }
  watch(%r{^lib/(.+)\.rb$})                           { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch(%r{^lib/tasks/(.+)\.rb$})                     { |m| "spec/lib/tasks#{m[1]}_spec.rb" }
  watch(%r{^app/controllers/(.+)_(controller)\.rb$})  { |m| ["spec/routing/#{m[1]}_routing_spec.rb", "spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb", "spec/acceptance/#{m[1]}_spec.rb"] }
  # Any matching model spec
  watch(%r{^app\/models/(.+)\.rb$})                    { |m| "spec/models#{m[1]}_spec.rb" }

end

guard 'cucumber', :all_after_pass => false, :all_on_start => false, zeus: true, parallel: true, bundler: false do
  watch(%r{^features/.+\.feature$})
  watch(%r{^features/support/.+$})          { 'features' }
  watch(%r{^features/step_definitions/(.+)_steps\.rb$}) { |m| Dir[File.join("**/#{m[1]}.feature")][0] || 'features' }
end

guard 'bundler' do
  watch('Gemfile')
  # Uncomment next line if Gemfile contain `gemspec' command
  # watch(/^.+\.gemspec/)
end


