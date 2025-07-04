
import jsPDF from "jspdf";
import { useState } from "react";
const ChecklistSaida = () => {
  const [form, setForm] = useState({
    data: "",
    hora: "",
    motorista: "",
    veiculo: "",
    km: "",
    combustivel: "Ok",
    pneus: "Ok",
    luzes: "Ok",
    freios: "Ok",
    documentos: "Ok",
    observacoes: "",
    aprovado: "Sim",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Checklist de Saída de Veículo", 20, 20);
  
    let y = 30;
    Object.entries(form).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, y);
      y += 10;
    });
  
    doc.save(`Checklist_${form.veiculo || "saida"}.pdf`);
  
    console.log("Checklist Enviado:", form);
    alert("Checklist enviado com sucesso e PDF gerado!");
  };
  

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Checklist de Saída</h2>
      <input placeholder="Data" value={form.data} onChange={(e) => handleChange("data", e.target.value)} /><br/>
      <input placeholder="Hora da Saída" value={form.hora} onChange={(e) => handleChange("hora", e.target.value)} /><br/>
      <input placeholder="Motorista" value={form.motorista} onChange={(e) => handleChange("motorista", e.target.value)} /><br/>
      <input placeholder="Veículo (Placa)" value={form.veiculo} onChange={(e) => handleChange("veiculo", e.target.value)} /><br/>
      <input placeholder="KM Inicial" value={form.km} onChange={(e) => handleChange("km", e.target.value)} /><br/>
      <select onChange={(e) => handleChange("combustivel", e.target.value)} value={form.combustivel}>
        <option value="Ok">Combustível OK</option>
        <option value="Não Ok">Combustível Não OK</option>
      </select><br/>
      <select onChange={(e) => handleChange("pneus", e.target.value)} value={form.pneus}>
        <option value="Ok">Pneus OK</option>
        <option value="Não Ok">Pneus Não OK</option>
      </select><br/>
      <select onChange={(e) => handleChange("luzes", e.target.value)} value={form.luzes}>
        <option value="Ok">Luzes OK</option>
        <option value="Não Ok">Luzes Não OK</option>
      </select><br/>
      <select onChange={(e) => handleChange("freios", e.target.value)} value={form.freios}>
        <option value="Ok">Freios OK</option>
        <option value="Não Ok">Freios Não OK</option>
      </select><br/>
      <select onChange={(e) => handleChange("documentos", e.target.value)} value={form.documentos}>
        <option value="Ok">Documentos OK</option>
        <option value="Não Ok">Documentos Não OK</option>
      </select><br/>
      <textarea placeholder="Observações" value={form.observacoes} onChange={(e) => handleChange("observacoes", e.target.value)} /><br/>
      <select onChange={(e) => handleChange("aprovado", e.target.value)} value={form.aprovado}>
        <option value="Sim">Aprovado para Saída</option>
        <option value="Não">Não Aprovado</option>
      </select><br/>
      <button onClick={handleSubmit}>Enviar Checklist</button>
    </div>
  );
};
export default ChecklistSaida;
