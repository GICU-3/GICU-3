set /p comment="Comment: "

cd .\GICU-3
git config --global user.email "example@gmail.com"
git config --global user.name "example"
git add -A
git commit -a -m "%comment%"
git push
pause