import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'
import { getToken } from "next-auth/jwt"

const questionnaire = collection(db, 'questionnaires');

export default async (req, res) => {
    if(req.method === 'POST'){
        const token = await getToken({ req })
        if(token.data.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        const { id, data } = JSON.parse(req.body);
        try {
            const docRef = doc(questionnaire, `${id}`);
            const oldTerm = await getDoc(docRef);
            if(oldTerm.data().term != data){
                await setDoc(docRef, {term: data, created_at: new Date()});
                const oldTermRef = doc(collection(docRef, 'oldTerms'));
                await setDoc(oldTermRef, {term: oldTerm.data().term, created_at: oldTerm.data().created_at, deleted_at: new Date()});
                res.status(200).json({ message: 'Termos do questionário atualizado com sucesso!' });
            }else{
                res.status(200).json({ message: 'Os termos já estão atualizados!' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }else if(req.method === 'GET'){
        const { id } = req.query;
        try {
            const docRef = doc(questionnaire, id);
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                res.status(200).json(docSnap.data());
            } else {
                res.status(404).json({ error: 'Questionário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}
