#!/usr/bin/osascript

tell application "iTerm2"
	tell current window

		# NODE SERVER
		tell the current session
			set tty_name to do shell script "basename " & (get tty)
			set working_dir to do shell script "pwd " & tty_name
			write text "export NPM_TOKEN=NotARealToken"
			write text "export NODE_ENV=staging"
			write text "export NODE_TLS_REJECT_UNAUTHORIZED=0"
			write text "export YOUVERSION_TOKEN_PHRASE='bob the builder builds some cool things'"
			write text "export NEW_RELIC_LICENSE_KEY=148b7b0a47e0219bd1117c19b692c94c779cdf33"
			write text "export YIR_SHA1_SECRET_KEY=SECRET"
			write text "cd '" & working_dir & "'"
			write text "Be sure to export OAUTH secrets!"
			write text "npm run dev:server"
		end tell

		# RUBY SERVER
		create tab with default profile
		tell current tab
			tell current session
				write text "export NPM_TOKEN=NotARealToken"
				write text "export SECURE_HOSTNAME=localhost"
				write text "export YIR_SHA1_SECRET_KEY=SECRET"
				write text "cd '" & working_dir & "/../ruby'"
				write text "y"
				write text "ruby ./script/rails server -b 0.0.0.0 -p 8001 -e development"
			end tell
		end tell

		# WATCH ASSETS
		create tab with default profile
		tell current tab
			tell current session
				write text "export NPM_TOKEN=NotARealToken"
				write text "cd '" & working_dir & "'"
				write text "npm run dev:watch:assets"
			end tell
		end tell

		# MEMCACHE
		create tab with default profile
		tell current tab
			tell current session
				write text "memcached -vv"
			end tell
		end tell

		# WATCH NODE
		create tab with default profile
		tell current tab
			tell current session
				write text "export NPM_TOKEN=NotARealToken"
				write text "cd '" & working_dir & "'"
				write text "npm run dev:watch:node"
			end tell
		end tell

		delay 18

		# OPEN IN BROWSER
		tell application "Google Chrome"
			set myTab to make new tab at end of tabs of window 1
			set URL of myTab to "http://localhost:8001"
		end tell

	end tell
end tell
