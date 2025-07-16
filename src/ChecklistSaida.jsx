import jsPDF from "jspdf";
import { useState } from "react";

const motoristasDB = ["João Silva", "Maria Souza", "Pedro Lima"];
const veiculosDB = ["ABC-1234", "DEF-5678", "GHI-9012"];

const ChecklistSaida = () => {
  const [form, setForm] = useState({
    data: "",
    hora: "",
    motorista: "",
    veiculo: "",
    km: "",
    combustivel: "",
    pneus: "",
    luzes: "Ok",
    luzesDetalhes: {
      farol: false,
      pisca: false,
      freio: false,
      meiaLuz: false,
      farolAlto: false,
    },
    freios: "Ok",
    freiosDetalhes: {
      dianteiro: false,
      traseiro: false,
    },
    documentos: "Ok",
    documentosDetalhes: {
      documento: false,
      manual: false,
      cartaoPosto: false,
    },
    observacoes: "",
    aprovado: "Sim",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNestedChange = (section, key, value) => {
    setForm({ ...form, [section]: { ...form[section], [key]: value } });
  };


  
 const handleSubmit = () => {
  const registrosSalvos = JSON.parse(localStorage.getItem("checklists") || "[]");
  localStorage.setItem("checklists", JSON.stringify([...registrosSalvos, form]));

  const doc = new jsPDF();
  let y = 20;

  const gerarPDF = () => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Checklist de Saída de Veículo", 20, y);
    y += 10;

    // Data e Hora em caixas arredondadas com fundo
    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 230); // cinza claro
    doc.roundedRect(15, y, 80, 15, 4, 4, 'F');
    doc.roundedRect(110, y, 85, 15, 4, 4, 'F');

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`Data: ${form.data || "-"}`, 20, y + 11);
    doc.text(`Hora: ${form.hora || "-"}`, 115, y + 11);

    y += 25;

    // Motorista e Veículo (Placa)
    doc.roundedRect(15, y, 180, 18, 4, 4, 'F');
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Motorista:", 20, y + 7);
    doc.setFont("helvetica", "normal");
    doc.text(form.motorista || "-", 50, y + 7);

    doc.setFont("helvetica", "bold");
    doc.text("Placa:", 120, y + 7);
    doc.setFont("helvetica", "normal");
    doc.text(form.veiculo || "-", 140, y + 7);

    doc.setFont("helvetica", "bold");
    doc.text("KM Inicial:", 20, y + 14);
    doc.setFont("helvetica", "normal");
    doc.text(`${form.km || "-"}`, 50, y + 14);

    y += 26;

    // Combustível e Pneus
    doc.roundedRect(15, y, 180, 15, 4, 4, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Combustível:", 20, y + 11);
    doc.setFont("helvetica", "normal");
    doc.text(form.combustivel || "-", 55, y + 11);

    doc.setFont("helvetica", "bold");
    doc.text("Pneus:", 120, y + 11);
    doc.setFont("helvetica", "normal");
    doc.text(form.pneus || "-", 145, y + 11);

    y += 25;

    // Verificações (Luzes, Freios, Documentos)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Verificações", 20, y);
    y += 8;

    const checklistItems = [
      { label: "Luzes", valor: form.luzes },
      { label: "Freios", valor: form.freios },
      { label: "Documentos", valor: form.documentos },
    ];

    doc.setFont("helvetica", "normal");
    checklistItems.forEach(({ label, valor }) => {
      doc.text(`${label}: ${valor || "-"}`, 25, y);
      y += 7;
    });

    // Detalhes quando "Não Ok"
    const renderDetalhes = (titulo, detalhes) => {
      const itens = Object.entries(detalhes || {}).filter(([_, v]) => v);
      if (itens.length) {
        doc.setFont("helvetica", "bold");
        doc.text(titulo, 25, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        itens.forEach(([k]) => {
          doc.text(`- ${k}`, 30, y);
          y += 5;
        });
        y += 4;
      }
    };

    if (form.luzes === "Não Ok") renderDetalhes("Luzes com problema:", form.luzesDetalhes);
    if (form.freios === "Não Ok") renderDetalhes("Freios com problema:", form.freiosDetalhes);
    if (form.documentos === "Não Ok") renderDetalhes("Documentos ausentes:", form.documentosDetalhes);

    // Observações
    if (form.observacoes) {
      const obs = doc.splitTextToSize(form.observacoes, 170);
      doc.setFont("helvetica", "bold");
      doc.text("Observações:", 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(obs, 25, y);
      y += obs.length * 6 + 5;
    }

    // Aprovado para Saída
    doc.setFont("helvetica", "bold");
    doc.text("Aprovado para Saída:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.aprovado || "-", 70, y);
    y += 30;

    // Assinatura
    doc.line(20, y, 100, y);
    y += 6;
    doc.text("Assinatura do Gerente", 20, y);

    doc.save(`Checklist_${form.veiculo || "saida"}.pdf`);
    alert("Checklist salvo localmente e PDF gerado com sucesso!");
  };

  gerarPDF();
};




  const renderLuzesDetalhes = () =>
    form.luzes === "Não Ok" && (
      <>
        <label><input type="checkbox" checked={form.luzesDetalhes.farol} onChange={(e) => handleNestedChange("luzesDetalhes", "farol", e.target.checked)} /> Farol</label><br/>
        <label><input type="checkbox" checked={form.luzesDetalhes.pisca} onChange={(e) => handleNestedChange("luzesDetalhes", "pisca", e.target.checked)} /> Pisca</label><br/>
        <label><input type="checkbox" checked={form.luzesDetalhes.freio} onChange={(e) => handleNestedChange("luzesDetalhes", "freio", e.target.checked)} /> Luz de Freio</label><br/>
        <label><input type="checkbox" checked={form.luzesDetalhes.meiaLuz} onChange={(e) => handleNestedChange("luzesDetalhes", "meiaLuz", e.target.checked)} /> Meia Luz</label><br/>
        <label><input type="checkbox" checked={form.luzesDetalhes.farolAlto} onChange={(e) => handleNestedChange("luzesDetalhes", "farolAlto", e.target.checked)} /> Farol Alto</label><br/>
      </>
    );

  const renderFreiosDetalhes = () =>
    form.freios === "Não Ok" && (
      <>
        <label><input type="checkbox" checked={form.freiosDetalhes.dianteiro} onChange={(e) => handleNestedChange("freiosDetalhes", "dianteiro", e.target.checked)} /> Problemas no Dianteiro</label><br/>
        <label><input type="checkbox" checked={form.freiosDetalhes.traseiro} onChange={(e) => handleNestedChange("freiosDetalhes", "traseiro", e.target.checked)} /> Problemas no Traseiro</label><br/>
      </>
    );

  const renderDocumentosDetalhes = () =>
    form.documentos === "Não Ok" && (
      <>
        <label><input type="checkbox" checked={form.documentosDetalhes.documento} onChange={(e) => handleNestedChange("documentosDetalhes", "documento", e.target.checked)} /> Documento</label><br/>
        <label><input type="checkbox" checked={form.documentosDetalhes.manual} onChange={(e) => handleNestedChange("documentosDetalhes", "manual", e.target.checked)} /> Manual</label><br/>
        <label><input type="checkbox" checked={form.documentosDetalhes.cartaoPosto} onChange={(e) => handleNestedChange("documentosDetalhes", "cartaoPosto", e.target.checked)} /> Cartão do Posto</label><br/>
      </>
    );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Checklist de Saída</h2>
      <input placeholder="Data" type="date" value={form.data} onChange={(e) => handleChange("data", e.target.value)} /><br/>
      <input placeholder="Hora da Saída" type="time" value={form.hora} onChange={(e) => handleChange("hora", e.target.value)} /><br/>

      {/* Autocomplete simples */}
      <input
        list="motoristas"
        placeholder="Motorista"
        value={form.motorista}
        onChange={(e) => handleChange("motorista", e.target.value)}
      />
      <datalist id="motoristas">
        {motoristasDB.map((m) => <option key={m} value={m} />)}
      </datalist><br/>

      <input
        list="veiculos"
        placeholder="Veículo (Placa)"
        value={form.veiculo}
        onChange={(e) => handleChange("veiculo", e.target.value)}
      />
      <datalist id="veiculos">
        {veiculosDB.map((v) => <option key={v} value={v} />)}
      </datalist><br/>

      <input type="number" placeholder="KM Inicial" value={form.km} onChange={(e) => handleChange("km", e.target.value)} /><br/>

      <select value={form.combustivel} onChange={(e) => handleChange("combustivel", e.target.value)}>
        <option value="">Selecione o nível de combustível</option>
        <option value="Reserva">Reserva</option>
        <option value="1/4">1/4</option>
        <option value="2/4">2/4</option>
        <option value="3/4">3/4</option>
        <option value="Cheio">Cheio</option>
      </select><br/>

      <select value={form.pneus} onChange={(e) => handleChange("pneus", e.target.value)}>
        <option value="">Condição dos Pneus</option>
        <option value="Novo">Novo</option>
        <option value="Desgaste leve">Desgaste leve</option>
        <option value="Desgaste médio">Desgaste médio</option>
        <option value="Desgaste severo">Desgaste severo</option>
        <option value="Comendo torto">Comendo torto</option>
      </select><br/>

      <select value={form.luzes} onChange={(e) => handleChange("luzes", e.target.value)}>
        <option value="Ok">Luzes OK</option>
        <option value="Não Ok">Luzes Não OK</option>
      </select><br/>
      {renderLuzesDetalhes()}

      <select value={form.freios} onChange={(e) => handleChange("freios", e.target.value)}>
        <option value="Ok">Freios OK</option>
        <option value="Não Ok">Freios Não OK</option>
      </select><br/>
      {renderFreiosDetalhes()}

      <select value={form.documentos} onChange={(e) => handleChange("documentos", e.target.value)}>
        <option value="Ok">Documentos OK</option>
        <option value="Não Ok">Documentos Não OK</option>
      </select><br/>
      {renderDocumentosDetalhes()}

      <textarea
        placeholder="Observações"
        rows={5}
        style={{ width: "100%" }}
        value={form.observacoes}
        onChange={(e) => handleChange("observacoes", e.target.value)}
      /><br/>

      <select value={form.aprovado} onChange={(e) => handleChange("aprovado", e.target.value)}>
        <option value="Sim">Aprovado para Saída</option>
        <option value="Não">Não Aprovado</option>
      </select><br/>

      <button onClick={handleSubmit}>Enviar Checklist</button>
    </div>
  );
};

export default ChecklistSaida;
