read -p 'input initial student id (min of id) : ' INITIAL_STUDENT_ID 
read -p 'input collection name : ' COLLECTION_NAME

sed -i "s/const INITIAL_STUDENT_ID.*/const INITIAL_STUDENT_ID = $INITIAL_STUDENT_ID;/" ./index.js
sed -i "s/const COLLECTION_NAME.*/const COLLECTION_NAME = \"$COLLECTION_NAME\";/" ./index.js

echo "DONE. Let run : yarn start or npm start"