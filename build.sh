version_xml=$(grep '<version>' info.xml | xargs)
version_number=${version_xml#"<version>"}
version_number=${version_number%"</version>"}
addon_name="SimpleThree_Wall"

echo "Building ${addon_name} version ${version_number}";

[[ -d build ]] && rm -r build

echo "Creating directory structure...";

mkdir "./build"
mkdir "./build/$addon_name-$version_number"
mkdir "./build/$addon_name-$version_number/files"

echo "Copying files...";

cp info.xml "./build/$addon_name-$version_number"
cp -r "./src" "./build/$addon_name-$version_number/files"

mv "./build/$addon_name-$version_number/files/src" "./build/$addon_name-$version_number/files/$addon_name"

echo "Building .c2addon file...";

powershell Compress-Archive "build/$addon_name-$version_number/*" "build/$addon_name-$version_number.zip"

mv "./build/$addon_name-$version_number.zip" "./build/$addon_name-$version_number.c2addon" 

echo "DONE";