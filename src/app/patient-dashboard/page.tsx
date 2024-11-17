"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Settings,
  Bell,
  Search,
  LogOut,
  Edit3,
  PlusCircle,
  Trash2,
  Save,
} from 'lucide-react';

interface User {
  id: number;
  userType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  licenseNumber?: string;
  name: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface Message {
  id: number;
  senderId: number;
  senderType: string;
  receiverId: number;
  receiverType: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  messages: Message[];
  participant: User;
  senderId: number;
  receiverId: number;
}

const PatientDashboard = () => {
  const router = useRouter();
  const [currentPatient, setCurrentPatient] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [messageSearchTerm, setMessageSearchTerm] = useState<string>('');
  const [doctors, setDoctors] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user && user.userType === 'patient') {
      setCurrentPatient(user);
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (currentPatient) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const doctorUsers = users.filter((u) => u.userType === 'doctor');
      setDoctors(doctorUsers);

      const savedNotes: Note[] = JSON.parse(
        localStorage.getItem(`patient_notes_${currentPatient.id}`) || '[]'
      );
      setNotes(savedNotes);

      const allConversations: Conversation[] = JSON.parse(
        localStorage.getItem('conversations') || '[]'
      );

      const patientConversations = allConversations
        .filter(
          (conv) =>
            conv.senderId === currentPatient.id ||
            conv.receiverId === currentPatient.id
        )
        .map((conv) => {
          const participantId =
            conv.senderId === currentPatient.id
              ? conv.receiverId
              : conv.senderId;
          const participant = users.find((u) => u.id === participantId);
          return { ...conv, participant };
        });
      setConversations(patientConversations);
    }
  }, [currentPatient]);

  useEffect(() => {
    if (currentPatient) {
      localStorage.setItem(
        `patient_notes_${currentPatient.id}`,
        JSON.stringify(notes)
      );
    }
  }, [notes, currentPatient]);

  const handleAddNote = () => {
    setIsEditingNote(true);
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleSaveNote = () => {
    if (noteTitle.trim() === '' && noteContent.trim() === '') {
      alert('Note title and content cannot both be empty.');
      return;
    }

    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, title: noteTitle, content: noteContent }
          : note
      );
      setNotes(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    setIsEditingNote(false);
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNote = (note: Note) => {
    setIsEditingNote(true);
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      if (selectedNote && selectedNote.id === noteId) {
        setIsEditingNote(false);
        setSelectedNote(null);
        setNoteTitle('');
        setNoteContent('');
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedDoctor) return;
  
    const messageData: Message = {
      id: Date.now(),
      senderId: currentPatient!.id,
      senderType: 'doctor',
      receiverId: selectedDoctor.id,
      receiverType: selectedDoctor.userType,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
  
    const allConversations: Conversation[] = JSON.parse(
      localStorage.getItem('conversations') || '[]'
    );
  
    const conversationIndex = allConversations.findIndex(
      (conv) =>
        (conv.senderId === currentPatient!.id &&
          conv.receiverId === selectedDoctor.id) ||
        (conv.senderId === selectedDoctor.id &&
          conv.receiverId === currentPatient!.id)
    );
  
    if (conversationIndex >= 0) {
      allConversations[conversationIndex].messages.push(messageData);
    } else {
      const newConversation: Conversation = {
        id: Date.now(),
        messages: [messageData],
        participant: selectedDoctor,
        senderId: currentPatient!.id,
        receiverId: selectedDoctor.id,
      };
      allConversations.push(newConversation);
    }
  
    localStorage.setItem('conversations', JSON.stringify(allConversations));
  
    // Update conversations state with participant
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedConversations = allConversations
      .filter(
        (conv) =>
          conv.senderId === currentPatient!.id ||
          conv.receiverId === currentPatient!.id
      )
      .map((conv) => {
        const participantId =
          conv.senderId === currentPatient!.id
            ? conv.receiverId
            : conv.senderId;
        const participant = users.find((u) => u.id === participantId);
        return { ...conv, participant };
      });
    setConversations(updatedConversations);
  
    setNewMessage('');
  };
  

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Valdosta Medicine
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="text-gray-500" />
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {currentPatient?.name[0]}
              </div>
              <button onClick={handleLogout}>
                <LogOut className="text-gray-500 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                    activeTab === 'messages'
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle size={20} />
                  <span>Messages</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                    activeTab === 'notes'
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Edit3 size={20} />
                  <span>My Notes</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] p-4 overflow-y-auto">
              {activeTab === 'messages' && (
                <div className="h-full flex">
                  {/* Doctors List */}
                  <div className="w-72 border-r h-full">
                    <div className="p-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search doctors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-5rem)]">
                      {doctors
                        .filter(
                          (doctor) =>
                            doctor.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            (doctor.licenseNumber &&
                              doctor.licenseNumber
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()))
                        )
                        .map((doctor) => (
                          <div
                            key={doctor.id}
                            onClick={() => setSelectedDoctor(doctor)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                              selectedDoctor?.id === doctor.id
                                ? 'bg-blue-50'
                                : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-1">
                                <h3 className="font-medium">{doctor.name}</h3>
                                <p className="text-sm text-gray-500">
                                  License: {doctor.licenseNumber}
                                </p>
                              </div>
                              <div
                                className={`w-2 h-2 rounded-full bg-green-500`}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Chat Area */}
                  {selectedDoctor ? (
                    <div className="flex-1 flex flex-col">
                      {/* Chat Header */}
                      <div className="p-4 border-b flex justify-between items-center">
                        <div>
                          <h2 className="font-semibold">
                            {selectedDoctor.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            License: {selectedDoctor.licenseNumber}
                          </p>
                        </div>
                        {/* Message Search */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search messages..."
                            value={messageSearchTerm}
                            onChange={(e) =>
                              setMessageSearchTerm(e.target.value)
                            }
                            className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Search
                            className="absolute left-3 top-2.5 text-gray-400"
                            size={20}
                          />
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {conversations
                          .find(
                            (c) =>
                              c.participant &&
                              c.participant.id === selectedDoctor.id
                          )
                          ?.messages.filter((message) =>
                            message.content
                              .toLowerCase()
                              .includes(messageSearchTerm.toLowerCase())
                          )
                          .map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${
                                message.senderId === currentPatient!.id
                                  ? 'justify-end'
                                  : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  message.senderId === currentPatient!.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100'
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      Select a doctor to start messaging
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="h-full p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Notes</h2>
                    <button
                      onClick={handleAddNote}
                      className="flex items-center space-x-1 text-blue-600 hover:underline"
                    >
                      <PlusCircle size={20} />
                      <span>New Note</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="border rounded-lg p-4 relative"
                      >
                        <h3 className="font-semibold mb-2">
                          {note.title || 'Untitled Note'}
                        </h3>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-4">
                          {note.content}
                        </p>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 absolute bottom-2 right-2">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Note Editor */}
                  {isEditingNote && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
                        <h3 className="text-xl font-semibold mb-4">
                          {selectedNote ? 'Edit Note' : 'New Note'}
                        </h3>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="w-full h-40 border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setIsEditingNote(false);
                              setSelectedNote(null);
                              setNoteTitle('');
                              setNoteContent('');
                            }}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNote}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                          >
                            <Save size={16} />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="h-full p-4">
                  <h2 className="text-xl font-semibold mb-4">Settings</h2>
                  {/* Settings content goes here */}
                  <p className="text-gray-500">Settings content goes here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;