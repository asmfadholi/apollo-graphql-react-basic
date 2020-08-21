import React, { useState, useEffect }from 'react';
import logo from './logo.svg';
import './App.css';

import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';

const LANGUAGE = gql`
  {
    language
  }
`;

const GET_CHAMPIONS = gql`
  {
    getChampions {
      name
    }
  }
`;

const GET_CHAMPION_BYNAME = gql`
    query GetChampionByName($championName: String!) {
      getChampionByName(name: $championName) {
        name
        attackDamage
      }
    }
`;

const UPDATE_CHAMPION= gql`
    mutation UpdateAttackDamage($championName: String!, $attackDamage: Float) {
      updateAttackDamage(name: $championName, attackDamage: $attackDamage) {
        name
        attackDamage
      }
    }
`;

function App() {
  const [champions, setChampions] = useState(null);
  const [champion, setChampion] = useState(null);
  const [championUpdated, setChampionUpdated] = useState(null);
  const [name, setName] = useState('');
  const [attack, setAttack] = useState('');

  const { loading, error, data } = useQuery(LANGUAGE);
  const [getChampions, stateChampions] = useLazyQuery(GET_CHAMPIONS);
  const [getChampion, stateChampion] = useLazyQuery(GET_CHAMPION_BYNAME);
  const [updateChampion, stateUpdateChampion] = useMutation(UPDATE_CHAMPION);

  // if (stateChampions.data && stateChampions.data.getChampions) {
  //   console.log(stateChampions)
  //   setChampions(stateChampions.data.getChampions[0].name);
  // }

  useEffect(() => {
    console.log('mess')
    if (!stateUpdateChampion.loading && stateUpdateChampion.data) {
      console.log('stateChampions')
      setChampionUpdated(stateUpdateChampion.data.updateAttackDamage);
      // getChampion({ variables: { championName: 'Ashe'}} )
    }
  }, [getChampion, stateUpdateChampion]);

  useEffect(() => {
    console.log('mess')
    if (!stateChampions.loading && stateChampions.data) {
      console.log('stateChampions')
      setChampions(stateChampions.data.getChampions);
    }
  }, [stateChampions]);

  useEffect(() => {
    // console.log('mess')
    if (!stateChampion.loading && stateChampion.data) {
      console.log('stateChampion')
      setChampion(stateChampion.data.getChampionByName);
    }
  }, [stateChampion]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <h2>
            Example 
          </h2>
          <p>
            Language : { data.language }
          </p>
          <p>
            Champions : { champions && !stateChampions.loading && JSON.stringify(champions) } { stateChampions.loading && <span> Loading... </span> }
          </p>
          <p>
            Champion : { champion && !stateChampion.loading && JSON.stringify(champion) } { stateChampion.loading && <span> Loading... </span> }
          </p>

          <p>
            Update Champion : { championUpdated && !stateUpdateChampion.loading && JSON.stringify(championUpdated) } { stateUpdateChampion.loading && <span> Loading... </span> }
          </p>
        </div> 
        <button onClick={() => getChampions()}>
          Get Champions
        </button>
        <button onClick={() => getChampion({ variables: { championName: 'Ashe'}} )}>
          Get Champion
        </button>
        <input onChange={(event) => setName(event.target.value) } value={ name } placeholder="name"></input>
        <input onChange={(event) => setAttack(event.target.value) } value={ attack } type="number" placeholder="attack"></input>
        <button onClick={() => updateChampion({ variables: { championName: name, attackDamage: Number(attack) }} )}>
          Update Champion
        </button>
      </header>
    </div>
  );
}

export default App;
