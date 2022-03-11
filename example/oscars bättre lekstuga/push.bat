set /p comment="Comment: "

cd .\GICU-3
git config --global user.email "oscarmf03@gmail.com"
git config --global user.name "Kiwimagic03"
git add -A
git commit -a -m "%comment%"
git push
pause