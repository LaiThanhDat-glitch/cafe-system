import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { menuAPI } from "../services/api";

const emptyForm = {
  tenMon: "",
  giaBan: "",
  maDanhMuc: "",
  moTa: "",
  slug: "",
  isNoiBat: false,
  daXoa: false,
  hinhAnhUrls: "",
  mainImageIndex: 0,
};

const toImageText = (images = []) => images.map((img) => img.urlAnh).join("\n");

export default function AdminMenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, itemRes] = await Promise.all([
        menuAPI.getCategories(),
        menuAPI.getItems({
          search,
          limit: 200,
          includeHidden: true,
          ...(category !== "all" ? { category } : {}),
        }),
      ]);
      setCategories(catRes.data);
      setItems(itemRes.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (item) => {
    setForm({
      tenMon: item.tenMon || "",
      giaBan: item.giaBan || "",
      maDanhMuc: item.maDanhMuc || "",
      moTa: item.moTa || "",
      slug: item.slug || "",
      isNoiBat: !!item.isNoiBat,
      daXoa: !!item.daXoa,
      hinhAnhUrls: toImageText(item.hinhAnh || []),
      mainImageIndex: Math.max(
        0,
        (item.hinhAnh || []).findIndex((img) => img.laAnhChinh),
      ),
    });
    setModal({ mode: "edit", item });
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      giaBan: Number(form.giaBan),
      hinhAnhUrls: form.hinhAnhUrls,
      mainImageIndex: Number(form.mainImageIndex || 0),
    };

    if (modal?.mode === "edit") {
      await menuAPI.updateItem(modal.item.maMon, payload);
    } else {
      await menuAPI.createItem(payload);
    }

    setModal(null);
    await fetchData();
  };

  const activeCategories = useMemo(
    () => [{ maDanhMuc: "all", tenDanhMuc: "Tất cả" }, ...categories],
    [categories],
  );

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-cream-300 px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-coffee-900">
              Quản lý thực đơn
            </h1>
            <p className="text-sm text-coffee-500">
              Chỉnh sửa món, giá, mô tả và hình ảnh
            </p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm">
            + Thêm món
          </button>
        </div>

        <div className="px-6 pt-4 flex flex-wrap gap-3 items-center">
          <input
            className="input-field max-w-sm"
            placeholder="Tìm món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field max-w-xs"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {activeCategories.map((cat) => (
              <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                {cat.tenDanhMuc}
              </option>
            ))}
          </select>
          <div className="flex-1" />
          <button onClick={fetchData} className="btn-secondary text-sm">
            Làm mới
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-coffee-500">Đang tải...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div key={item.maMon} className={`card overflow-hidden ${item.daXoa ? 'opacity-60 border-dashed border-cream-400' : ''}`}>
                  <div className="aspect-[4/3] bg-cream-100">
                    {item.hinhAnh?.[0] ? (
                      <img
                        src={item.hinhAnh[0].urlAnh}
                        alt={item.tenMon}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        ☕
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-coffee-900">
                          {item.tenMon}
                        </h3>
                        <p className="text-sm text-coffee-500">
                          {item.danhMuc?.tenDanhMuc || "Chưa có danh mục"}
                        </p>
                      </div>
                      <span className="font-bold text-coffee-700">
                        {Number(item.giaBan || 0).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <p className="text-sm text-coffee-600 line-clamp-2">
                      {item.moTa || "Chưa có mô tả"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-coffee-500">
                      <span>
                        {item.isNoiBat ? "⭐ Nổi bật" : "Bình thường"}
                      </span>
                      <span>•</span>
                      <span>{(item.hinhAnh || []).length} ảnh</span>
                      {item.daXoa && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 font-medium">Đã ẩn</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="btn-secondary flex-1 text-sm"
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-center py-16 text-coffee-400">
                  <p className="text-5xl mb-3">🍵</p>
                  <p>Chưa có món nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-cream-200">
              <h2 className="font-display text-xl text-coffee-900">
                {modal.mode === "edit" ? "Sửa món" : "Thêm món"}
              </h2>
            </div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-coffee-700 mb-1">
                  Tên món
                </label>
                <input
                  className="input-field"
                  value={form.tenMon}
                  onChange={(e) => setForm({ ...form, tenMon: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-coffee-700 mb-1">
                  Giá bán
                </label>
                <input
                  className="input-field"
                  type="number"
                  value={form.giaBan}
                  onChange={(e) => setForm({ ...form, giaBan: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-coffee-700 mb-1">
                  Danh mục
                </label>
                <select
                  className="input-field"
                  value={form.maDanhMuc}
                  onChange={(e) =>
                    setForm({ ...form, maDanhMuc: e.target.value })
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-coffee-700 mb-1">
                  Slug
                </label>
                <input
                  className="input-field"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-coffee-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  className="input-field min-h-24"
                  value={form.moTa}
                  onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-coffee-700 mb-1">
                  Hình ảnh (mỗi dòng một URL hoặc ngăn cách bằng dấu phẩy)
                </label>
                <textarea
                  className="input-field min-h-28"
                  value={form.hinhAnhUrls}
                  onChange={(e) =>
                    setForm({ ...form, hinhAnhUrls: e.target.value })
                  }
                  placeholder="https://.../anh-1.jpg\nhttps://.../anh-2.jpg"
                />
              </div>
              <div>
                <label className="block text-sm text-coffee-700 mb-1">
                  Ảnh chính
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  value={form.mainImageIndex}
                  onChange={(e) =>
                    setForm({ ...form, mainImageIndex: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-coffee-700 mt-7">
                  <input
                    type="checkbox"
                    checked={form.isNoiBat}
                    onChange={(e) =>
                      setForm({ ...form, isNoiBat: e.target.checked })
                    }
                  />
                  Nổi bật
                </label>
                {modal.mode === "edit" && (
                  <label className="inline-flex items-center gap-2 text-sm text-coffee-700">
                    <input
                      type="checkbox"
                      checked={form.daXoa}
                      onChange={(e) =>
                        setForm({ ...form, daXoa: e.target.checked })
                      }
                    />
                    Ẩn món
                  </label>
                )}
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="btn-secondary">
                Hủy
              </button>
              <button onClick={handleSave} className="btn-primary">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
