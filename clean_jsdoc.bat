@if exist "./jsdoc" (
    echo Cleaning the docs folder "./docs"...
    rmdir "./docs" /s /q
    echo ...Done!
)
