import { api_caller } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import {
  X,
  Plus,
  Trash,
  WifiHigh,
  ForkKnife,
  MapPin,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setModalVisibility } from "@/redux/slices/modalSlice";

interface CompareModalProps {
  modalData: any;
}

const CompareModal = ({ modalData }: CompareModalProps) => {
  const dispatch = useDispatch();

  /** ---------------- STATES ---------------- */
  // 4 slots: first PG from page, rest empty
  const [compareList, setCompareList] = useState<any[]>([
    modalData,
    null,
    null,
    null,
  ]);

  const [availablePGs, setAvailablePGs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPGSelector, setShowPGSelector] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  /** ---------------- FETCH SIMILAR PGs ---------------- */
  useEffect(() => {
    const loadSimilarPGs = async () => {
      try {
        setLoading(true);

        const coords = modalData?.coordinates?.join(",");

        const res = await api_caller<any[]>(
          "GET",
          `${API.PG.GET_PG_NEAR_PG}/${modalData?.pg_id}?coordinates=${coords}`
        );

        if (res.success) {
          setAvailablePGs(res?.data);
          console.log("Available PGs:", res?.data);
        } else {
          toast.error(`${res.message} : ${res.error}`);
          setAvailablePGs([]);
        }
      } catch (err) {
        console.error("Error fetching similar PGs:", err);
        setAvailablePGs([]);
      } finally {
        setLoading(false);
      }
    };

    if (modalData?.coordinates) {
      loadSimilarPGs();
    }
  }, [modalData]);

  /** ---------------- HANDLERS ---------------- */
  const removePG = (index: number) => {
    const updated = [...compareList];
    updated[index] = null;
    setCompareList(updated);
  };

  const openPGSelector = (index: number) => {
    setSelectedSlotIndex(index);
    setShowPGSelector(true);
  };

  const selectPG = (pgData: any) => {
    const pg = pgData.pginfo;

    const updated = [...compareList];
    updated[selectedSlotIndex as number] = {
      pg_id: pg._id,
      pg_name: pg.pg_name,
      minRent: pg.minRent || 4999,
      address: pg.address,
      pg_type: pg.pg_type,
      wifi: pg.wifi_available,
      food: pg.food_available,
      images: pg.pg_images,
    };

    setCompareList(updated);
    setShowPGSelector(false);
    setSelectedSlotIndex(null);
  };

  /** ---------------- UI ---------------- */
  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
        <div className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl my-8">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Compare PGs
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Compare up to 4 PGs side by side
                </p>
              </div>
              <button
                onClick={() =>
                  dispatch(setModalVisibility({ open: false, type: null }))
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* ---------- TOP 4 PG SLOTS ---------- */}
          <div className="grid grid-cols-4 gap-6 p-6 bg-gray-50 border-b">
            {compareList.map((pg, idx) => (
              <div key={idx} className="relative">
                {pg ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border">
                    {/* Image */}
                    <div className="relative h-40">
                      {pg.images?.[0] ? (
                        <img
                          src={pg.images[0].pg_image_url}
                          alt={pg.pg_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <MapPin size={48} className="text-gray-400" />
                        </div>
                      )}

                      {idx !== 0 && (
                        <button
                          onClick={() => removePG(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-500 hover:text-white rounded-full shadow"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm truncate">
                        {pg.pg_name}
                      </h3>
                      <p className="text-lg font-bold text-green-600">
                        ₹{pg.minRent}
                      </p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openPGSelector(idx)}
                    className="w-full min-h-[260px] border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 flex flex-col items-center justify-center gap-3 text-gray-500"
                  >
                    <Plus size={24} />
                    <span className="font-semibold text-sm">Add PG</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ---------- COMPARISON TABLE ---------- */}
          <div className="p-6">
            <div className="border rounded-xl overflow-hidden">
              <Section title="PRICING">
                <ComparisonRow
                  label="Monthly Rent"
                  values={compareList.map((pg) => (pg ? `₹${pg.minRent}` : ""))}
                  highlight
                />
              </Section>

              <Section title="AMENITIES">
                <ComparisonRow
                  label={
                    <>
                      <ForkKnife size={14} className="inline mr-1" />
                      Food
                    </>
                  }
                  values={compareList.map((pg) =>
                    pg
                      ? pg.food === "yes"
                        ? "Available"
                        : "Not Available"
                      : ""
                  )}
                />
                <ComparisonRow
                  label={
                    <>
                      <WifiHigh size={14} className="inline mr-1" />
                      WiFi
                    </>
                  }
                  values={compareList.map((pg) =>
                    pg
                      ? pg.wifi === "yes"
                        ? "Available"
                        : "Not Available"
                      : ""
                  )}
                />
              </Section>

              <Section title="GENERAL">
                <ComparisonRow
                  label="PG Type"
                  values={compareList.map((pg) => (pg ? pg.pg_type : ""))}
                />
                <ComparisonRow
                  label="Address"
                  values={compareList.map((pg) => (pg ? pg.address : ""))}
                  truncate
                />
              </Section>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- PG SELECTOR MODAL ---------- */}
      {showPGSelector && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Select a PG</h3>
              <button
                onClick={() => setShowPGSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : availablePGs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePGs?.map((pgData) => {
                    const pg = pgData.pginfo;
                    const alreadyAdded = compareList.some(
                      (item) => item?.pg_id === pg._id
                    );

                    return (
                      <button
                        key={pg._id}
                        onClick={() => !alreadyAdded && selectPG(pgData)}
                        disabled={alreadyAdded}
                        className={`text-left border-2 rounded-xl overflow-hidden ${
                          alreadyAdded
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-500 hover:shadow-lg"
                        }`}
                      >
                        <div className="h-40">
                          {pg.pg_images?.[0] ? (
                            <img
                              src={pg.pg_images[0].pg_image_url}
                              alt={pg.pg_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <MapPin size={48} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold">{pg.pg_name}</h4>
                          <p className="text-green-600 font-semibold">
                            ₹{pg.minRent}/month
                          </p>
                          <p className="text-sm text-gray-500">{pg.address}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No similar PGs found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareModal;

/* -------------------- SUB COMPONENTS -------------------- */

const Section = ({ title, children }: any) => (
  <div className="border-t first:border-t-0">
    <div className="bg-gray-100 px-6 py-3 border-b">
      <h3 className="text-xs font-bold tracking-wide text-gray-700">{title}</h3>
    </div>
    {children}
  </div>
);

const ComparisonRow = ({ label, values, highlight, truncate }: any) => (
  <div className="grid grid-cols-5 border-b last:border-b-0">
    <div className="bg-gray-50 px-6 py-4 text-sm font-medium border-r">
      {label}
    </div>
    {values.map((val: string, idx: number) => (
      <div
        key={idx}
        className={`px-6 py-4 text-sm border-r last:border-r-0 ${
          highlight ? "font-semibold text-green-600" : "text-gray-600"
        } ${truncate ? "truncate" : ""}`}
      >
        {val || <span className="text-gray-300">—</span>}
      </div>
    ))}
  </div>
);
