import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js'
import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js'
// import { getStorage } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js'

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyA6whR_ty2-tsOeyt7VabbyDuaurGnyOZE",
	authDomain: "krcolonia-github-io.firebaseapp.com",
	databaseURL: "https://krcolonia-github-io-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "krcolonia-github-io",
	storageBucket: "krcolonia-github-io.firebasestorage.app",
	messagingSenderId: "489970511447",
	appId: "1:489970511447:web:fe897620652f7a37207d12"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)

export { auth, db }