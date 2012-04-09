java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.js --js_output_file ../ui/min/jquery.ui.map.min.js
Packer -o ../ui/min/jquery.ui.map.min.js -m packer ../ui/min/jquery.ui.map.min.js

rem java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.overlays.js --js_output_file ../ui/min/jquery.ui.map.overlays.min.js
rem Packer -o ../ui/min/jquery.ui.map.overlays.min.js -m packer ../ui/min/jquery.ui.map.overlays.min.js

rem java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.services.js --js_output_file ../ui/min/jquery.ui.map.services.min.js
rem Packer -o ../ui/min/jquery.ui.map.services.min.js -m packer ../ui/min/jquery.ui.map.services.min.js

rem java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.rdfa.js --js_output_file ../ui/min/jquery.ui.map.rdfa.min.js
rem Packer -o ../ui/min/jquery.ui.map.rdfa.min.js -m packer ../ui/min/jquery.ui.map.rdfa.min.js

rem java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.microdata.js --js_output_file ../ui/min/jquery.ui.map.microdata.min.js
rem Packer -o ../ui/min/jquery.ui.map.microdata.min.js -m packer ../ui/min/jquery.ui.map.microdata.min.js

rem java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.microformat.js --js_output_file ../ui/min/jquery.ui.map.microformat.min.js
rem Packer -o ../ui/min/jquery.ui.map.microformat.min.js -m packer ../ui/min/jquery.ui.map.microformat.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../ui/jquery.ui.map.full.js --js_output_file ../ui/min/jquery.ui.map.full.min.js
Packer -o ../ui/min/jquery.ui.map.full.min.js -m packer ../ui/min/jquery.ui.map.full.min.js

pause