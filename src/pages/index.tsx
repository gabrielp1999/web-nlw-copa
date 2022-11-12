import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logo from '../assets/logo.svg';
import usersAvatarExample from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import {FormEvent, useEffect, useState} from 'react';

interface HomeProps {
  poolCount: number,
  guessCount: number,
  usersCount: number
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  const createPool = async (event: FormEvent) => {
    event.preventDefault();
    setPoolTitle("");
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response?.data;
      await navigator.clipboard.writeText(code);

      alert("Bolão criado com successo, o código foi copiado para área de transferência!")
    } catch (err) {
      console.log(err);
      alert("Falha ao criar o bolão, tente novamente");
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image quality={100} src={logo} alt="logo"/>

        <h1 className='mt-14 text-white text-3xl font-bold leading-tight'>
          Crie seu propio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image quality={100} src={usersAvatarExample} alt="" />
          <strong className='text-gray-100'>
            <span className='text-ignite-500'>+ {props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className='input flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm'
            type="text" 
            required placeholder='Qual é o nome do seu bolão'   
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 
              font-bold text-sm uppercase hover:bg-yellow-700'
            >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>Após criar seu bolão você receberá um código único que poderá usar para convidar outras pessoas</p>

        <div 
          className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image quality={100} src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold  text-2xl'>+ {props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image quality={100} src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold  text-2xl'>+ {props.guessCount}</span>
              <span>Palpites Enviados</span>
            </div>
          </div>

        </div>
      </main>

      <Image quality={100} src={appPreviewImg} alt="imagem de 2 celulares" /> 
    </div>
  )
}

export async function getStaticProps(context){

  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('/pools/count'), 
    api.get('/guesses/count'),
    api.get('/users/count')
  ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount:usersCountResponse.data.count
    }
  }
}