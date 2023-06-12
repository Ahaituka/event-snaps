'use client'


import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker'
import { updateFolderId } from '../../../libs/setFolder';

interface HostDashboardProps {

}

const HostDashboard: React.FC<HostDashboardProps> = (props) => {

  const [link, setLink] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [openPicker, authResponse] = useDrivePicker();  

  const { data: session } = useSession()
  const userId = (session?.user as { id: string })?.id;


  const handleCreateLink = () => {    
    if (!folderId) {
      alert('Please select a folder first');
      return;
    }
    setLink(`http://localhost:3000/guest/${(session?.user as {id:string })?.id}`);
  };


  const handleGuestSite = () =>
  {
    console.log("hello")
  }


  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      viewId: "FOLDERS",
      supportDrives: true,
      setSelectFolderEnabled: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log("data",data?.docs?.[0]?.id)
        const folderId = data?.docs?.[0]?.id
        setFolderId(folderId)
        //store folderid in the database using prisma
        updateFolderId(userId,folderId)
      },
    })
  }


  return (
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl font-bold mt-20 mb-10">Host Dashboard</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
        onClick={handleGuestSite}
      >
        Customise Guest Website
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mr-4"
        onClick={() => handleOpenPicker()} 
      >
        Select Google Drive Folder
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mr-4"
        onClick={handleCreateLink}
      >
        Create Shareable Link
      </button>

      {link && (
        <div className="mt-4">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </div>
      )}

      <button
        className="bg-red-500 text-white py-2 px-4 rounded"
        onClick={() => signOut({callbackUrl : 'http://localhost:3000/'})}
      >
        Sign out
      </button>
      
    </div>
  );
};

export default HostDashboard;