set /p comment="Comment: "

cd C:\Users\Deltagare\Desktop\GICU-3
git config --global user.email "simon.k.hellsing@gmail.com"
git config --global user.name "031simon"
git add -A
git commit -a -m "%comment%"
git push
pause