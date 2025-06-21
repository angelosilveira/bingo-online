import React, { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import { User, CreateUserData, UpdateUserData } from "@/models/User";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersList = await UserService.listUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Ocorreu um erro ao carregar a lista de usuários.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const createdUser = await UserService.createUser(userData);
      if (createdUser) {
        toast({
          title: "Sucesso!",
          description: "Usuário criado com sucesso.",
        });
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro ao criar usuário",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!editingUser) return;

    try {
      const updatedUser = await UserService.updateUser(
        editingUser.id,
        userData
      );
      if (updatedUser) {
        toast({
          title: "Sucesso!",
          description: "Usuário atualizado com sucesso.",
        });
        setIsModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await UserService.deleteUser(userId);
      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso.",
      });
      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="mb-4">Adicionar Novo Usuário</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Edite os dados do usuário."
                : "Preencha os dados para criar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            initialData={editingUser || undefined}
            isEditing={!!editingUser}
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Nome de Usuário</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este usuário? Esta ação
                          não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Users;
