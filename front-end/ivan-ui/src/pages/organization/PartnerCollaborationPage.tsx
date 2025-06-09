import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  collaborationType: string;
  status: "active" | "pending" | "inactive";
}

export default function PartnerCollaborationPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data with Vietnamese context
  const partners: Partner[] = [
    {
      id: "1",
      name: "Công ty TNHH Phát triển Công nghệ Việt",
      contactPerson: "Nguyễn Văn An",
      email: "van.an@techviet.vn",
      phone: "0912345678",
      collaborationType: "Tài trợ kỹ thuật",
      status: "active",
    },
    {
      id: "2",
      name: "Quỹ Từ thiện Ánh Dương",
      contactPerson: "Trần Thị Bình",
      email: "binh.tran@anhduong.org",
      phone: "0923456789",
      collaborationType: "Đồng tổ chức sự kiện",
      status: "active",
    },
    {
      id: "3",
      name: "Trường Đại học Bách Khoa Hà Nội",
      contactPerson: "Lê Công Danh",
      email: "danh.le@hust.edu.vn",
      phone: "0934567890",
      collaborationType: "Cung cấp tình nguyện viên",
      status: "pending",
    },
  ];

  // Filter partners based on search term
  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Đối tác</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <Input
            placeholder="Tìm kiếm đối tác..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Thêm đối tác mới</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm đối tác mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để thêm đối tác hợp tác mới.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên đối tác
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">
                  Người liên hệ
                </Label>
                <Input id="contactPerson" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input id="phone" type="tel" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="collaborationType" className="text-right">
                  Loại hợp tác
                </Label>
                <Input id="collaborationType" className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đối tác</CardTitle>
          <CardDescription>
            Quản lý tất cả các đối tác hợp tác với tổ chức của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đối tác</TableHead>
                <TableHead>Người liên hệ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Loại hợp tác</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.contactPerson}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.collaborationType}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        partner.status === "active"
                          ? "bg-green-100 text-green-800"
                          : partner.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {partner.status === "active"
                        ? "Đang hoạt động"
                        : partner.status === "pending"
                        ? "Đang chờ"
                        : "Không hoạt động"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                      <Button variant="outline" size="sm">
                        Chỉnh sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
