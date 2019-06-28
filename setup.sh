fileIndex=$1

read -p 'input initial student id (min of id) : ' INITIAL_STUDENT_ID 
read -p 'input collection name : ' COLLECTION_NAME
read -p 'input file data name (the file just has a collection) : ' FILE_DATA_PATH

touch $FILE_DATA_PATH
echo "[{}]" > $FILE_DATA_PATH

sed -i "s/const INITIAL_STUDENT_ID.*/const INITIAL_STUDENT_ID = $INITIAL_STUDENT_ID;/" $fileIndex
sed -i "s/const COLLECTION_NAME.*/const COLLECTION_NAME = '$COLLECTION_NAME';/" $fileIndex
sed -i "s/const FILE_DATA_PATH.*/const FILE_DATA_PATH = '$FILE_DATA_PATH';/" $fileIndex

echo "DONE. Let run : yarn start or npm start"