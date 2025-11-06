import { auth, db } from './FirebaseInit.js'
import { ref, set, get, update, remove } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js'

get(ref(db, 'exp')).then((snapshot) => {
	if(snapshot.exists) {
		console.log(snapshot.val())
	}
})