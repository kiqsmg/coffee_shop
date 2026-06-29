import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

// "espera ha X" a partir do createdAt do chamado
const waitLabel = (createdAt) => {
  const mins = Math.floor((Date.now() - new Date(createdAt)) / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  return `há ${Math.floor(mins / 60)} h`;
};

function RequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get("/requests")
      .then((res) => setRequests(res.data))
      .catch(() => setError("Não foi possível carregar os chamados."));
  }, []);

  // Carrega ao abrir e atualiza sozinho a cada 5 segundos
  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  const atender = async (id) => {
    await api.put(`/requests/${id}`);
    load();
  };

  const pendentes = requests.filter((r) => r.status === "pendente");
  const atendidos = requests.filter((r) => r.status === "atendido");

  return (
    <div>
      <p className="mb-8 font-body text-cream/60">
        Atualiza automaticamente a cada 5 segundos.
      </p>
      {error && <p className="mb-6 font-body text-red-400">{error}</p>}

      <h2 className="mb-4 font-heading text-xl font-bold text-honey">
        Pendentes ({pendentes.length})
      </h2>
      {pendentes.length === 0 ? (
        <p className="font-body text-cream/50">Nenhum chamado pendente.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pendentes.map((r) => (
            <li
              key={r._id}
              className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
            >
              <span className="font-body">
                <strong>{r.userName}</strong> está pedindo{" "}
                <strong className="text-honey">{r.productName}</strong>
                <span className="ml-2 text-sm text-cream/40">
                  espera {waitLabel(r.createdAt)}
                </span>
              </span>
              <button
                onClick={() => atender(r._id)}
                className="btn-primary whitespace-nowrap text-sm"
              >
                Atender
              </button>
            </li>
          ))}
        </ul>
      )}

      {atendidos.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 font-heading text-xl font-bold text-cream/50">
            Atendidos
          </h2>
          <ul className="flex flex-col gap-2">
            {atendidos.map((r) => (
              <li
                key={r._id}
                className="rounded-2xl border border-cream/10 px-5 py-3 font-body text-cream/50"
              >
                {r.userName} — {r.productName} ✓
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RequestsAdmin;
