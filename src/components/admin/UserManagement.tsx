import { useState } from 'react';
import { users } from '../../lib/mock-data';
import { User } from '../../lib/types';
// A modal component would be created here in a real app
// import EditUserModal from './EditUserModal';

const UserManagement = () => {
  const [allUsers] = useState<User[]>(users);
  // const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b font-medium bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Subscription Plan</th>
              <th scope="col" className="px-6 py-3">Usage</th>
              <th scope="col" className="px-6 py-3">Plan Renews</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold">{user.name} {user.role === 'admin' && '(Admin)'}</div>
                  <div className="text-brand-gray">{user.email}</div>
                </td>
                <td className="px-6 py-4">{user.plan}</td>
                <td className="px-6 py-4">{`${user.usage.used} / ${user.usage.total}`}</td>
                <td className="px-6 py-4">{user.planRenews}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    // onClick={() => setEditingUser(user)}
                    className="font-medium text-brand-purple hover:text-brand-purple/80"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />} */}
    </div>
  );
};

export default UserManagement;
