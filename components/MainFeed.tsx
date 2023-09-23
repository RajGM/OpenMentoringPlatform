import React, { useEffect, useState } from 'react';
import HackathonTile from './HackathonTile';
import { useAtom } from 'jotai';
import { categoriesAtom, filterAtom } from '@lib/atoms';
import { firestore } from '@lib/firebase';
import Loader from './Loader';

interface CardFieldProps {
    arrData: any[]; // You should replace 'any' with the actual type of the data
}

const CardField: React.FC<CardFieldProps> = ({ arrData }) => {
    return arrData ? arrData.map((indiData) => <div className="eventCard"> <HackathonTile data={indiData} key={indiData.id} /></div>) : null;
}

const MainFeed: React.FC = () => {

    const [category] = useAtom(categoriesAtom);
    const [filter] = useAtom(filterAtom);
    const [oppData, setOppData] = useState<any[]>([]); // Replace 'any' with the actual type of the data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        queryTest(category, filter);
    }, [filter]);

    async function queryTest(category: string, filter: string) {
        let query;
        if (filter === 'all' || filter === 'All') {
            query = firestore.collection(category.charAt(0).toUpperCase() + category.slice(1));
        } else {
            query = firestore.collection(category.charAt(0).toUpperCase() + category.slice(1)).where('filters', '==', filter.toLowerCase());
        }
        setLoading(true);
        const queryData = (await query.get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOppData(queryData);
        console.log("queryData:", queryData);
        setLoading(false);
    }

    if (loading == true) {
        return (<div className='fullHeightMain'>
            <Loader show={true} className="middle" />
        </div>)
    } else {
        if (oppData.length == 0) {
            return (<div className='fullHeightMain middle'>
                <h1>Cleaning Data and testing multiple features integrations</h1>
                <h1>It will be completed by tomorrow, soon</h1>
                <h1>Sorry, no opportunities found!</h1>
                <h2>Please add some for the community</h2>
            </div>)
        }
        else {
            return (
                <div className="mainFeed fullHeightMain">
                    {oppData.length >= 1 ? <CardField arrData={oppData} /> : <Loader show={true} className="middle" />}
                </div>
            );
        }
    }

}

export default MainFeed;

/*

let data = {
    title: "HackHarvard",
    Link: "https://hackharvard.io/",
    ApplicationDate: "2021-09-01",
    EventDate: "2021-09-01",
    PostedBy: "RajGM",
    Real: 0,
    Spam: 0,
    Sponsored: false
}

*/