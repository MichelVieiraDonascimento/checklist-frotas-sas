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
  // Salva no localStorage antes
  const registrosSalvos = JSON.parse(localStorage.getItem("checklists") || "[]");
  localStorage.setItem("checklists", JSON.stringify([...registrosSalvos, form]));

  const doc = new jsPDF();
  const gerarPDF = () => {
    let y = 20;

    // Cabeçalho com título e data
    doc.setFontSize(16);
    doc.text("Checklist de Saída de Veículo", 60, y);
    doc.setFontSize(12);
    doc.text(`Data: ${form.data}`, 150, y);
    y += 10;
    doc.text(`Hora: ${form.hora}`, 150, y);
    y += 20;

    // Motorista e veículo
    doc.setFont("helvetica", "bold");
    doc.text("Motorista:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.motorista || "-", 50, y);

    doc.setFont("helvetica", "bold");
    doc.text("Placa:", 120, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.veiculo || "-", 140, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("KM Inicial:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${form.km || "-"}`, 50, y);
    y += 15;

    // Combustível e pneus
    doc.setFont("helvetica", "bold");
    doc.text("Nível de Combustível:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.combustivel || "-", 70, y);

    doc.setFont("helvetica", "bold");
    doc.text("Condição dos Pneus:", 120, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.pneus || "-", 165, y);
    y += 15;

    // Itens principais
    doc.setFont("helvetica", "bold");
    doc.text("Luzes:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.luzes || "-", 45, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Freios:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.freios || "-", 45, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Documentos:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.documentos || "-", 55, y);
    y += 15;

    // Detalhes “Não OK”
    if (form.luzes === "Não Ok" && form.luzesDetalhes) {
      const detalhes = Object.entries(form.luzesDetalhes).filter(([_, v]) => v).map(([k]) => `- ${k}`);
      if (detalhes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Luzes com problema:", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        detalhes.forEach((d) => {
          doc.text(d, 25, y);
          y += 6;
        });
        y += 4;
      }
    }

    if (form.freios === "Não Ok" && form.freiosDetalhes) {
      const detalhes = Object.entries(form.freiosDetalhes).filter(([_, v]) => v).map(([k]) => `- ${k}`);
      if (detalhes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Freios com problema:", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        detalhes.forEach((d) => {
          doc.text(d, 25, y);
          y += 6;
        });
        y += 4;
      }
    }

    if (form.documentos === "Não Ok" && form.documentosDetalhes) {
      const detalhes = Object.entries(form.documentosDetalhes).filter(([_, v]) => v).map(([k]) => `- ${k}`);
      if (detalhes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Documentos ausentes:", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        detalhes.forEach((d) => {
          doc.text(d, 25, y);
          y += 6;
        });
        y += 4;
      }
    }

    // Observações
    if (form.observacoes) {
      const obs = doc.splitTextToSize(`Observações: ${form.observacoes}`, 170);
      doc.setFont("helvetica", "bold");
      doc.text("Observações:", 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(obs, 25, y);
      y += obs.length * 6 + 5;
    }

    // Aprovado
    doc.setFont("helvetica", "bold");
    doc.text(`Aprovado para Saída:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(form.aprovado || "-", 80, y);
    y += 30;

    // Assinatura
    doc.line(20, y, 100, y);
    y += 5;
    doc.text("Assinatura do motorista", 20, y);

    doc.save(`Checklist_${form.veiculo || "saida"}.pdf`);
    alert("Checklist salvo localmente e PDF gerado com sucesso!");
  };

  // Logo no topo
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "https://play-lh.googleusercontent.com/KuL7Hcvz6ZNxbbuwhNMHFFxQM5pDwDpHOOs2jfx_enwU74He-uxEqxEzBEt3iZ_T3Yg=w3840-h2160-rw";

  img.onload = () => {
    doc.addImage(img, "PNG", 20, 10, 30, 30);
    gerarPDF();
  };

  img.onerror = () => {
    console.warn("⚠️ Logo não carregada. PDF será gerado sem imagem.");
    gerarPDF();
  };
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
