import { INITIAL_USERS } from '../data/mockUsers';
import { Address, ApiResponse, User } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

class UserService {
  private users: User[] = [...INITIAL_USERS];
  private currentUserId: string = 'usr-customer-001';

  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId) || this.users[0];
    return { ...user };
  }

  public setCurrentUserId(id: string): void {
    if (this.users.some((u) => u.id === id)) {
      this.currentUserId = id;
    }
  }

  public registerUser(user: User): void {
    const index = this.users.findIndex((u) => u.id === user.id || u.email === user.email);
    if (index > -1) {
      this.users[index] = { ...this.users[index], ...user };
    } else {
      this.users.unshift(user);
    }
  }

  // GET /users/:id
  public async getUserById(id: string): Promise<ApiResponse<User>> {
    const start = performance.now();
    let user = this.users.find((u) => u.id === id);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*, addresses(*)').eq('id', id).single();
        if (!error && data) {
          user = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            avatarUrl: data.avatar_url || '',
            role: data.role || 'customer',
            addresses: (data.addresses || []).map((a: any) => ({
              id: a.id,
              fullName: a.full_name,
              phoneNumber: a.phone_number,
              street: a.street,
              city: a.city,
              state: a.state,
              postalCode: a.postal_code,
              country: a.country,
              isDefault: a.is_default
            }))
          };
          this.registerUser(user);
        }
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(20, 50);
    }

    const duration = Math.round(performance.now() - start);

    if (!user) {
      const errRes = createErrorResponse<User>('User', `User with ID '${id}' not found`, 404);
      apiBus.logCall('User', 'GET', `/users/${id}`, 404, duration, null, errRes);
      return errRes;
    }

    const res = createSuccessResponse('User', { ...user }, 200);
    apiBus.logCall('User', 'GET', `/users/${id}`, 200, duration, null, { id: user.id, name: user.name });
    return res;
  }

  // PUT /users/:id
  public async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    const start = performance.now();
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      const errRes = createErrorResponse<User>('User', `User '${id}' not found`, 404);
      apiBus.logCall('User', 'PUT', `/users/${id}`, 404, 20, updates, errRes);
      return errRes;
    }

    this.users[index] = { ...this.users[index], ...updates };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('users')
          .update({
            name: updates.name,
            phone: updates.phone,
            avatar_url: updates.avatarUrl
          })
          .eq('id', id);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(40, 80);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('User', { ...this.users[index] }, 200, 'User profile updated');
    apiBus.logCall('User', 'PUT', `/users/${id} [Supabase/Store]`, 200, duration, updates, this.users[index]);
    return res;
  }

  // GET /users/:id/addresses
  public async getUserAddresses(id: string): Promise<ApiResponse<Address[]>> {
    const start = performance.now();
    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      const errRes = createErrorResponse<Address[]>('User', `User '${id}' not found`, 404);
      apiBus.logCall('User', 'GET', `/users/${id}/addresses`, 404, duration, null, errRes);
      return errRes;
    }

    const res = createSuccessResponse('User', [...user.addresses], 200);
    apiBus.logCall('User', 'GET', `/users/${id}/addresses`, 200, duration, null, user.addresses);
    return res;
  }

  // POST /users/:id/addresses
  public async addAddress(id: string, addressData: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    const start = performance.now();
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      const errRes = createErrorResponse<Address>('User', `User '${id}' not found`, 404);
      apiBus.logCall('User', 'POST', `/users/${id}/addresses`, 404, 20, addressData, errRes);
      return errRes;
    }

    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now().toString(36)}`,
      isDefault: addressData.isDefault ?? user.addresses.length === 0
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(newAddress);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('addresses').insert([
          {
            id: newAddress.id,
            user_id: id,
            full_name: newAddress.fullName,
            phone_number: newAddress.phoneNumber,
            street: newAddress.street,
            city: newAddress.city,
            state: newAddress.state,
            postal_code: newAddress.postalCode,
            country: newAddress.country,
            is_default: newAddress.isDefault
          }
        ]);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(40, 80);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('User', newAddress, 201, 'Address added successfully');
    apiBus.logCall('User', 'POST', `/users/${id}/addresses`, 201, duration, addressData, newAddress);
    return res;
  }

  // DELETE /users/:id/addresses/:addressId
  public async deleteAddress(id: string, addressId: string): Promise<ApiResponse<{ id: string }>> {
    const start = performance.now();
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      const errRes = createErrorResponse<{ id: string }>('User', `User '${id}' not found`, 404);
      apiBus.logCall('User', 'DELETE', `/users/${id}/addresses/${addressId}`, 404, 20, null, errRes);
      return errRes;
    }

    user.addresses = user.addresses.filter((a) => a.id !== addressId);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('addresses').delete().eq('id', addressId);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(30, 60);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('User', { id: addressId }, 200, 'Address deleted');
    apiBus.logCall('User', 'DELETE', `/users/${id}/addresses/${addressId}`, 200, duration, null, { id: addressId });
    return res;
  }

  // GET /users (Admin)
  public async getAllUsers(): Promise<ApiResponse<User[]>> {
    const start = performance.now();
    let userList = [...this.users];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && data && data.length > 0) {
          userList = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            phone: d.phone || '',
            avatarUrl: d.avatar_url || '',
            role: d.role || 'customer',
            addresses: []
          }));
        }
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(30, 70);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('User', userList, 200);
    apiBus.logCall('User', 'GET', '/users', 200, duration, null, { count: userList.length });
    return res;
  }
}

export const userService = new UserService();
