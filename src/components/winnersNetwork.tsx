import React, { useState, useEffect, useContext, createContext } from 'react';
import { ServiceContext } from '../services/ApiService';


const WinnersNetwork = () => {
    var winners: any[] = [];
    var totalWinners: number = 0;
    const pageSize = 7;

    const fetchWinnersForPage = async (page: number) => {
        const { data, headers } = await ServiceContext.apiService.fetchData(`/winners?_page=${page}&_limit=${pageSize}`);
        if (data) {
            winners = data;
            totalWinners = parseInt(headers.get('X-Total-Count') || '0');
        }
    };

    const postWinner = async (winner: { id: number; wins: number; time: number }) => {
        await ServiceContext.apiService.postData(`winner`, JSON.stringify(winner));
    };

    return { pageSize, winners, totalWinners, fetchWinnersForPage, postWinner }

}


const WinnersContext = createContext({
    winnersNetwork: WinnersNetwork(),
});

export const useWinnersNetwork = () => useContext(WinnersContext);