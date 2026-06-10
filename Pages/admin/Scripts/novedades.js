// ============================== MÓDULO PERMISOS ==============================
(function(){
  const STORAGE_PERMISOS = "operpan_permisos";
  const STORAGE_USERS = "operpan_usuarios";
  let permisos = [], empleados = [];
  let currentPermisoId = null;

  function loadPermisosData(){
    const stored = localStorage.getItem(STORAGE_PERMISOS);
    if(!stored){
      permisos = [
        { id: "p1", empleadoId: "EMP-2024-156", tipo: "cambio_turno", fechaInicio: "2025-06-15", fechaFin: "2025-06-15", justificacion: "Asunto familiar", nuevoHorario: "Tarde (2pm-10pm)", estado: "pendiente", fechaSolicitud: "2025-06-14T09:15:00", decisionFecha: null, decisionPor: null, motivoRechazo: null },
        { id: "p2", empleadoId: "EMP-2024-157", tipo: "personal", fechaInicio: "2025-06-16", fechaFin: "2025-06-16", justificacion: "Cita médica", nuevoHorario: "", estado: "pendiente", fechaSolicitud: "2025-06-13T10:30:00", decisionFecha: null, decisionPor: null, motivoRechazo: null },
        { id: "p3", empleadoId: "EMP-2024-155", tipo: "vacaciones", fechaInicio: "2025-07-01", fechaFin: "2025-07-07", justificacion: "Descanso anual", nuevoHorario: "", estado: "aprobado", fechaSolicitud: "2025-06-10T08:00:00", decisionFecha: "2025-06-11T14:00:00", decisionPor: "Administrador", motivoRechazo: null }
      ];
      localStorage.setItem(STORAGE_PERMISOS, JSON.stringify(permisos));
    } else permisos = JSON.parse(stored);
    const storedUsers = localStorage.getItem(STORAGE_USERS);
    if(storedUsers) empleados = JSON.parse(storedUsers);
    else empleados = [
      { id: "EMP-2024-156", nombres: "Eddier", apellidos: "Paz Pardo", estado: "activo" },
      { id: "EMP-2024-155", nombres: "Paula", apellidos: "Herrera", estado: "activo" },
      { id: "EMP-2024-157", nombres: "Santiago", apellidos: "Muñeton", estado: "activo" }
    ];
  }
  function savePermisos(){ localStorage.setItem(STORAGE_PERMISOS, JSON.stringify(permisos)); }
  function showMessage(msg){ const toast = document.getElementById("liveToast"); if(toast){ document.getElementById("toastMsg").innerText = msg; toast.style.display = "block"; setTimeout(()=>toast.style.display="none",3000); } else alert(msg); }
  function updatePermisosKPIs(){
    const pend = permisos.filter(p=>p.estado==="pendiente").length;
    const now = new Date(); const mes=now.getMonth(), año=now.getFullYear();
    const aprobados = permisos.filter(p=>p.estado==="aprobado" && p.decisionFecha && new Date(p.decisionFecha).getMonth()===mes && new Date(p.decisionFecha).getFullYear()===año).length;
    const rechazados = permisos.filter(p=>p.estado==="rechazado" && p.decisionFecha && new Date(p.decisionFecha).getMonth()===mes && new Date(p.decisionFecha).getFullYear()===año).length;
    document.getElementById("permisosKpiPendientes").innerText = pend;
    document.getElementById("permisosKpiAprobados").innerText = aprobados;
    document.getElementById("permisosKpiRechazados").innerText = rechazados;
  }
  function renderPermisosPendientes(){
    const container = document.getElementById("permisosSolicitudesContainer");
    const pend = permisos.filter(p=>p.estado==="pendiente");
    if(pend.length===0){ container.innerHTML='<div class="alert alert-light">No hay solicitudes pendientes.</div>'; return; }
    let html="";
    pend.forEach(p=>{
      const emp = empleados.find(e=>e.id===p.empleadoId) || { nombres:"Eddier Paz", apellidos:"" };
      html+=`<div class="admin-request-card"><div class="d-flex justify-content-between"><div><strong>${emp.nombres} ${emp.apellidos}</strong><br><small>${p.tipo}</small><p class="mt-1 small">${p.justificacion.substring(0,80)}</p><div><small><i class="bi bi-calendar-range date-icon"></i> ${p.fechaInicio} → ${p.fechaFin}</small></div></div><div><button class="btn btn-sm btn-primary-corporate verPermisoBtn" data-id="${p.id}"><i class="bi bi-eye"></i> Ver</button></div></div></div>`;
    });
    container.innerHTML = html;
    document.querySelectorAll(".verPermisoBtn").forEach(btn=>btn.addEventListener("click",()=>verDetallePermiso(btn.dataset.id)));
  }
  function renderPermisosHistorial(){
    const tbody = document.getElementById("permisosHistorialBody");
    const todos = [...permisos].sort((a,b)=>new Date(b.fechaSolicitud)-new Date(a.fechaSolicitud));
    tbody.innerHTML="";
    todos.forEach(p=>{
      const emp = empleados.find(e=>e.id===p.empleadoId) || { nombres:"Eddier Paz", apellidos:"" };
      let badge = p.estado==="pendiente"? '<span class="badge badge-pending">Pendiente</span>' : (p.estado==="aprobado"? '<span class="badge badge-approved">Aprobado</span>' : '<span class="badge badge-rejected">Rechazado</span>');
      tbody.innerHTML+=`<tr>
        <td data-label="Fecha solicitud">${new Date(p.fechaSolicitud).toLocaleString()}</td>
        <td data-label="Empleado">${emp.nombres} ${emp.apellidos}</td>
        <td data-label="Tipo">${p.tipo}</td>
        <td data-label="Fechas">${p.fechaInicio} - ${p.fechaFin}</td>
        <td data-label="Estado">${badge}</td>
        <td data-label="Aprobado por">${p.decisionPor || "—"}</td>
        <td data-label="Acciones"><button class="btn btn-sm btn-outline-secondary verHistorialPermisoBtn" data-id="${p.id}"><i class="bi bi-eye"></i> Ver</button></td>
      </tr>`;
    });
    document.querySelectorAll(".verHistorialPermisoBtn").forEach(btn=>btn.addEventListener("click",()=>verDetalleHistorialPermiso(btn.dataset.id)));
  }
  function verDetallePermiso(id){
    currentPermisoId=id;
    const p = permisos.find(p=>p.id===id);
    if(!p) return;
    const emp = empleados.find(e=>e.id===p.empleadoId);
    document.getElementById("permisosModalBody").innerHTML = `<div class="row"><div class="col-md-6"><strong>Empleado:</strong><br>${emp.nombres} ${emp.apellidos}</div><div class="col-md-6"><strong>Tipo:</strong><br>${p.tipo}</div><div class="col-12"><strong>Justificación:</strong><br>${p.justificacion}</div><div class="col-6"><strong>Fechas:</strong><br><i class="bi bi-calendar3"></i> ${p.fechaInicio} → ${p.fechaFin}</div>${p.nuevoHorario?`<div class="col-6"><strong>Nuevo horario:</strong><br>${p.nuevoHorario}</div>`:''}</div>`;
    const modal = new bootstrap.Modal(document.getElementById("permisosDetalleModal"));
    modal.show();
  }
  function verDetalleHistorialPermiso(id){
    const p = permisos.find(p=>p.id===id);
    const emp = empleados.find(e=>e.id===p.empleadoId);
    document.getElementById("permisosModalBody").innerHTML = `<div class="row"><div class="col-md-6"><strong>Empleado:</strong><br>${emp.nombres} ${emp.apellidos}</div><div class="col-md-6"><strong>Tipo:</strong><br>${p.tipo}</div><div class="col-12"><strong>Justificación:</strong><br>${p.justificacion}</div><div class="col-6"><strong>Fechas:</strong><br><i class="bi bi-calendar3"></i> ${p.fechaInicio} → ${p.fechaFin}</div>${p.motivoRechazo?`<div class="col-12 text-danger"><strong>Motivo rechazo:</strong><br>${p.motivoRechazo}</div>`:''}</div>`;
    document.getElementById("permisosAprobarBtn").disabled=true;
    document.getElementById("permisosRechazarBtn").disabled=true;
    const modal = new bootstrap.Modal(document.getElementById("permisosDetalleModal"));
    modal.show();
    modal._element.addEventListener('hidden.bs.modal',()=>{ document.getElementById("permisosAprobarBtn").disabled=false; document.getElementById("permisosRechazarBtn").disabled=false; },{once:true});
  }
  function aprobarPermiso(id){
    const p = permisos.find(p=>p.id===id);
    if(p && p.estado==="pendiente"){ p.estado="aprobado"; p.decisionFecha=new Date().toISOString(); p.decisionPor="Administrador"; savePermisos(); updatePermisosKPIs(); renderPermisosPendientes(); renderPermisosHistorial(); showMessage("Permiso aprobado correctamente."); }
  }
  function rechazarPermiso(id, motivo){
    const p = permisos.find(p=>p.id===id);
    if(p && p.estado==="pendiente"){ p.estado="rechazado"; p.decisionFecha=new Date().toISOString(); p.decisionPor="Administrador"; p.motivoRechazo=motivo; savePermisos(); updatePermisosKPIs(); renderPermisosPendientes(); renderPermisosHistorial(); showMessage("Permiso rechazado."); }
  }
  document.getElementById("permisosAprobarBtn")?.addEventListener("click",()=>{
    const modal = bootstrap.Modal.getInstance(document.getElementById("permisosDetalleModal"));
    modal.hide();
    new bootstrap.Modal(document.getElementById("permisosConfirmApproveModal")).show();
  });
  document.getElementById("permisosConfirmApprove")?.addEventListener("click",()=>{ aprobarPermiso(currentPermisoId); bootstrap.Modal.getInstance(document.getElementById("permisosConfirmApproveModal")).hide(); });
  document.getElementById("permisosRechazarBtn")?.addEventListener("click",()=>{
    bootstrap.Modal.getInstance(document.getElementById("permisosDetalleModal")).hide();
    new bootstrap.Modal(document.getElementById("permisosConfirmRejectFirstModal")).show();
  });
  document.getElementById("permisosConfirmRejectFirst")?.addEventListener("click",()=>{
    bootstrap.Modal.getInstance(document.getElementById("permisosConfirmRejectFirstModal")).hide();
    new bootstrap.Modal(document.getElementById("permisosRejectModal")).show();
  });
  document.getElementById("permisosConfirmReject")?.addEventListener("click",()=>{
    const reason = document.getElementById("permisosRejectReason").value.trim();
    if(!reason){ showMessage("Debe ingresar un motivo de rechazo."); return; }
    rechazarPermiso(currentPermisoId, reason);
    bootstrap.Modal.getInstance(document.getElementById("permisosRejectModal")).hide();
  });
  loadPermisosData(); updatePermisosKPIs(); renderPermisosPendientes(); renderPermisosHistorial();
})();

// ============================== MÓDULO INCAPACIDADES ==============================
(function(){
  const STORAGE_INCAP = "operpan_incapacidades";
  let incapacidades = [];
  let currentIncapId = null;
  function loadIncapData(){
    const stored = localStorage.getItem(STORAGE_INCAP);
    if(!stored){
      incapacidades = [
        { id: "inc1", empleadoId: "EMP-2024-156", empleadoNombre: "Eddier Paz Pardo", titulo: "Procedimiento odontológico", descripcion: "Endodoncia", fechaInicio: "2025-06-10", fechaFin: "2025-06-15", estado: "pendiente", fechaSolicitud: "2025-06-09T10:00:00", archivo: "doc.pdf", motivoRechazo: null, decisionPor: null, decisionFecha: null },
        { id: "inc2", empleadoId: "EMP-2024-157", empleadoNombre: "Santiago Muñeton", titulo: "Fractura", descripcion: "Fractura dedo", fechaInicio: "2025-06-05", fechaFin: "2025-06-20", estado: "pendiente", fechaSolicitud: "2025-06-04T15:30:00", archivo: "doc.pdf", motivoRechazo: null, decisionPor: null, decisionFecha: null },
        { id: "inc3", empleadoId: "EMP-2024-158", empleadoNombre: "Andrea Herrera", titulo: "Gripa", descripcion: "Cuadro gripal", fechaInicio: "2025-06-01", fechaFin: "2025-06-05", estado: "aprobada", fechaSolicitud: "2025-05-30T09:00:00", archivo: "doc.pdf", motivoRechazo: null, decisionPor: "Administrador", decisionFecha: "2025-06-01T08:00:00" }
      ];
      localStorage.setItem(STORAGE_INCAP, JSON.stringify(incapacidades));
    } else incapacidades = JSON.parse(stored);
  }
  function saveIncap(){ localStorage.setItem(STORAGE_INCAP, JSON.stringify(incapacidades)); }
  function showMessage(msg){ const toast = document.getElementById("liveToast"); if(toast){ document.getElementById("toastMsg").innerText = msg; toast.style.display = "block"; setTimeout(()=>toast.style.display="none",3000); } else alert(msg); }
  function updateIncapKPIs(){
    const pend = incapacidades.filter(i=>i.estado==="pendiente").length;
    const now = new Date(); const mes=now.getMonth(), año=now.getFullYear();
    const aprobadas = incapacidades.filter(i=>i.estado==="aprobada" && i.decisionFecha && new Date(i.decisionFecha).getMonth()===mes && new Date(i.decisionFecha).getFullYear()===año).length;
    const rechazadas = incapacidades.filter(i=>i.estado==="rechazada" && i.decisionFecha && new Date(i.decisionFecha).getMonth()===mes && new Date(i.decisionFecha).getFullYear()===año).length;
    document.getElementById("incapacidadesKpiPendientes").innerText = pend;
    document.getElementById("incapacidadesKpiAprobadas").innerText = aprobadas;
    document.getElementById("incapacidadesKpiRechazadas").innerText = rechazadas;
  }
  function renderIncapacidadesLista(){
    const container = document.getElementById("incapacidadesListaContainer");
    let filtradas = [...incapacidades];
    const estado = document.getElementById("incapacidadesFiltroEstado").value;
    const busqueda = document.getElementById("incapacidadesBuscarEmpleado").value.toLowerCase();
    if(estado!=="todas") filtradas = filtradas.filter(i=>i.estado===estado);
    if(busqueda) filtradas = filtradas.filter(i=>i.empleadoNombre.toLowerCase().includes(busqueda));
    if(filtradas.length===0){ container.innerHTML='<div class="alert alert-light">No hay incapacidades con esos filtros.</div>'; return; }
    let html="";
    filtradas.forEach(i=>{
      let badgeClass = i.estado==="pendiente"?"badge-pending":(i.estado==="aprobada"?"badge-approved":"badge-rejected");
      html+=`<div class="incapacidad-card"><div class="d-flex justify-content-between"><div><strong>${i.empleadoNombre}</strong><br><small>${i.titulo}</small><p class="mt-1 small">${i.descripcion}</p><div><small><i class="bi bi-calendar-range"></i> ${i.fechaInicio} → ${i.fechaFin}</small> <span class="badge ${badgeClass}">${i.estado}</span></div></div><div><button class="btn btn-sm btn-primary-corporate verIncapBtn" data-id="${i.id}"><i class="bi bi-eye"></i> Ver</button></div></div>${i.motivoRechazo?`<div class="alert alert-danger mt-2 small">Motivo: ${i.motivoRechazo}</div>`:''}</div>`;
    });
    container.innerHTML = html;
    document.querySelectorAll(".verIncapBtn").forEach(btn=>btn.addEventListener("click",()=>verDetalleIncapacidad(btn.dataset.id)));
  }
  function verDetalleIncapacidad(id){
    currentIncapId = id;
    const i = incapacidades.find(i=>i.id===id);
    document.getElementById("incapacidadesModalBody").innerHTML = `<p><strong>Empleado:</strong> ${i.empleadoNombre}</p><p><strong>Título:</strong> ${i.titulo}</p><p><strong>Descripción:</strong> ${i.descripcion}</p><p><strong>Período:</strong> <i class="bi bi-calendar3"></i> ${i.fechaInicio} → ${i.fechaFin}</p><p><strong>Estado:</strong> ${i.estado}</p>${i.motivoRechazo?`<p class="text-danger"><strong>Motivo rechazo:</strong> ${i.motivoRechazo}</p>`:''}`;
    const modal = new bootstrap.Modal(document.getElementById("incapacidadesDetalleModal"));
    const aprobarBtn = document.getElementById("incapacidadesAprobarBtn"), rechazarBtn = document.getElementById("incapacidadesRechazarBtn");
    if(i.estado!=="pendiente"){ aprobarBtn.disabled=true; rechazarBtn.disabled=true; } else { aprobarBtn.disabled=false; rechazarBtn.disabled=false; }
    modal.show();
  }
  function aprobarIncapacidad(id){
    const i = incapacidades.find(i=>i.id===id);
    if(i && i.estado==="pendiente"){ i.estado="aprobada"; i.decisionFecha=new Date().toISOString(); i.decisionPor="Administrador"; saveIncap(); updateIncapKPIs(); renderIncapacidadesLista(); renderHistorialIncapacidades(); showMessage("Incapacidad aprobada."); }
  }
  function rechazarIncapacidad(id, motivo){
    const i = incapacidades.find(i=>i.id===id);
    if(i && i.estado==="pendiente"){ i.estado="rechazada"; i.decisionFecha=new Date().toISOString(); i.decisionPor="Administrador"; i.motivoRechazo=motivo; saveIncap(); updateIncapKPIs(); renderIncapacidadesLista(); renderHistorialIncapacidades(); showMessage("Incapacidad rechazada."); }
  }
  function renderHistorialIncapacidades(){
    const tbody = document.getElementById("incapacidadesHistorialBody");
    if(!tbody) return;
    const todos = [...incapacidades].sort((a,b)=>new Date(b.fechaSolicitud)-new Date(a.fechaSolicitud));
    tbody.innerHTML = "";
    todos.forEach(inc => {
      let badge = inc.estado==="pendiente"? '<span class="badge badge-pending">Pendiente</span>' : (inc.estado==="aprobada"? '<span class="badge badge-approved">Aprobada</span>' : '<span class="badge badge-rejected">Rechazada</span>');
      tbody.innerHTML += `<tr>
        <td data-label="Fecha solicitud">${new Date(inc.fechaSolicitud).toLocaleString()}</td>
        <td data-label="Empleado">${inc.empleadoNombre}</td>
        <td data-label="Diagnóstico">${inc.titulo}</td>
        <td data-label="Período">${inc.fechaInicio} → ${inc.fechaFin}</td>
        <td data-label="Estado">${badge}</td>
        <td data-label="Aprobado por">${inc.decisionPor || "—"}</td>
        <td data-label="Acciones"><button class="btn btn-sm btn-outline-secondary verHistorialIncapacidadBtn" data-id="${inc.id}"><i class="bi bi-eye"></i> Ver</button></td>
      </tr>`;
    });
    document.querySelectorAll(".verHistorialIncapacidadBtn").forEach(btn => btn.addEventListener("click", () => {
      const inc = incapacidades.find(i => i.id === btn.dataset.id);
      if(inc) {
        document.getElementById("incapacidadesModalBody").innerHTML = `<p><strong>Empleado:</strong> ${inc.empleadoNombre}</p><p><strong>Diagnóstico:</strong> ${inc.titulo}</p><p><strong>Descripción:</strong> ${inc.descripcion}</p><p><strong>Período:</strong> <i class="bi bi-calendar3"></i> ${inc.fechaInicio} → ${inc.fechaFin}</p><p><strong>Estado:</strong> ${inc.estado}</p>${inc.motivoRechazo?`<p class="text-danger"><strong>Motivo rechazo:</strong> ${inc.motivoRechazo}</p>`:''}`;
        const modal = new bootstrap.Modal(document.getElementById("incapacidadesDetalleModal"));
        document.getElementById("incapacidadesAprobarBtn").disabled = true;
        document.getElementById("incapacidadesRechazarBtn").disabled = true;
        modal.show();
      }
    }));
  }
  document.getElementById("incapacidadesAprobarBtn")?.addEventListener("click",()=>{ bootstrap.Modal.getInstance(document.getElementById("incapacidadesDetalleModal")).hide(); new bootstrap.Modal(document.getElementById("incapacidadesConfirmApproveModal")).show(); });
  document.getElementById("incapacidadesConfirmApprove")?.addEventListener("click",()=>{ aprobarIncapacidad(currentIncapId); bootstrap.Modal.getInstance(document.getElementById("incapacidadesConfirmApproveModal")).hide(); });
  document.getElementById("incapacidadesRechazarBtn")?.addEventListener("click",()=>{ bootstrap.Modal.getInstance(document.getElementById("incapacidadesDetalleModal")).hide(); new bootstrap.Modal(document.getElementById("incapacidadesConfirmRejectFirstModal")).show(); });
  document.getElementById("incapacidadesConfirmRejectFirst")?.addEventListener("click",()=>{ bootstrap.Modal.getInstance(document.getElementById("incapacidadesConfirmRejectFirstModal")).hide(); new bootstrap.Modal(document.getElementById("incapacidadesRejectModal")).show(); });
  document.getElementById("incapacidadesConfirmReject")?.addEventListener("click",()=>{ const reason = document.getElementById("incapacidadesRejectReason").value.trim(); if(!reason){ showMessage("Debe ingresar un motivo de rechazo."); return; } rechazarIncapacidad(currentIncapId, reason); bootstrap.Modal.getInstance(document.getElementById("incapacidadesRejectModal")).hide(); });
  document.getElementById("incapacidadesFiltroEstado")?.addEventListener("change", ()=>{ renderIncapacidadesLista(); renderHistorialIncapacidades(); });
  document.getElementById("incapacidadesBuscarEmpleado")?.addEventListener("input", ()=>{ renderIncapacidadesLista(); renderHistorialIncapacidades(); });
  loadIncapData(); updateIncapKPIs(); renderIncapacidadesLista(); renderHistorialIncapacidades();
})();

// ============================== MÓDULO CERTIFICADOS ==============================
(function(){
  const certificadosData = [
    { id:1, empleado:"Santiago Muñeton", cargo:"Panadero", tipo:"Certificado laboral", fechaISO:"2025-06-01T09:15:00", estado:"Emitido" },
    { id:2, empleado:"Eddier Paz", cargo:"Panadero Principal", tipo:"Certificado de ingresos", fechaISO:"2025-06-02T11:30:00", estado:"Emitido" },
    { id:3, empleado:"Andrea Herrera", cargo:"Repostera", tipo:"Certificado de antigüedad", fechaISO:"2025-05-28T14:20:00", estado:"Emitido" },
    { id:4, empleado:"Santiago Muñeton", cargo:"Panadero", tipo:"Certificado de ingresos", fechaISO:"2025-05-20T10:10:00", estado:"Emitido" },
    { id:5, empleado:"Eddier Paz", cargo:"Panadero Principal", tipo:"Certificado laboral", fechaISO:"2025-06-03T08:45:00", estado:"Emitido" },
    { id:6, empleado:"Andrea Herrera", cargo:"Repostera", tipo:"Certificado laboral", fechaISO:"2025-05-15T16:30:00", estado:"Emitido" },
    { id:7, empleado:"Eddier Paz", cargo:"Panadero Principal", tipo:"Certificado de antigüedad", fechaISO:"2025-06-04T09:00:00", estado:"Emitido" },
    { id:8, empleado:"Santiago Muñeton", cargo:"Panadero", tipo:"Certificado de antigüedad", fechaISO:"2025-05-25T12:15:00", estado:"Emitido" },
    { id:9, empleado:"Andrea Herrera", cargo:"Repostera", tipo:"Certificado de ingresos", fechaISO:"2025-06-02T15:40:00", estado:"Emitido" }
  ];
  function actualizarKPICertificados(){
    const hoy = new Date(); const mes=hoy.getMonth(), año=hoy.getFullYear();
    let emitidosMes=0, emitidosHoy=0;
    certificadosData.forEach(c=>{
      const f=new Date(c.fechaISO);
      if(f.getMonth()===mes && f.getFullYear()===año) emitidosMes++;
      if(f.toDateString()===hoy.toDateString()) emitidosHoy++;
    });
    document.getElementById("certificadosKpiMes").innerText=emitidosMes;
    document.getElementById("certificadosKpiHoy").innerText=emitidosHoy;
  }
  function renderCertificados(){
    let filtrados = [...certificadosData];
    const emp = document.getElementById("certificadosFiltroEmpleado").value;
    const tipo = document.getElementById("certificadosFiltroTipo").value;
    const desde = document.getElementById("certificadosFiltroDesde").value;
    const hasta = document.getElementById("certificadosFiltroHasta").value;
    if(emp!=="todos") filtrados = filtrados.filter(c=>c.empleado===emp);
    if(tipo!=="todos") filtrados = filtrados.filter(c=>c.tipo===tipo);
    if(desde) filtrados = filtrados.filter(c=>new Date(c.fechaISO) >= new Date(desde));
    if(hasta) filtrados = filtrados.filter(c=>new Date(c.fechaISO) <= new Date(hasta));
    const tbody = document.getElementById("certificadosTablaBody");
    const sinRes = document.getElementById("certificadosSinResultados");
    if(filtrados.length===0){ tbody.innerHTML=""; sinRes.classList.remove("d-none"); return; }
    sinRes.classList.add("d-none");
    tbody.innerHTML = filtrados.map(c=>`<tr>
      <td data-label="Empleado"><strong>${c.empleado}</strong></td>
      <td data-label="Cargo">${c.cargo}</td>
      <td data-label="Tipo de certificado"><span class="badge badge-approved">${c.tipo}</span></td>
      <td data-label="Fecha de emisión">${new Date(c.fechaISO).toLocaleString()}</td>
      <td data-label="Estado"><span class="badge bg-success bg-opacity-10 text-success">${c.estado}</span></td>
    </tr>`).join("");
  }
  document.getElementById("certificadosFiltroEmpleado")?.addEventListener("change", renderCertificados);
  document.getElementById("certificadosFiltroTipo")?.addEventListener("change", renderCertificados);
  document.getElementById("certificadosFiltroDesde")?.addEventListener("change", renderCertificados);
  document.getElementById("certificadosFiltroHasta")?.addEventListener("change", renderCertificados);
  document.getElementById("certificadosBtnLimpiar")?.addEventListener("click",()=>{
    document.getElementById("certificadosFiltroEmpleado").value="todos";
    document.getElementById("certificadosFiltroTipo").value="todos";
    document.getElementById("certificadosFiltroDesde").value="";
    document.getElementById("certificadosFiltroHasta").value="";
    renderCertificados();
  });
  actualizarKPICertificados(); renderCertificados();
})();

// Control de pestañas
document.querySelectorAll(".novedades-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".novedades-tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    document.querySelectorAll(".tab-pane").forEach(pane=>pane.classList.remove("active"));
    document.getElementById(`tab${target.charAt(0).toUpperCase()+target.slice(1)}`).classList.add("active");
  });
});

// Logout y toggle sidebar
document.getElementById("logoutBtn")?.addEventListener("click",()=>{ setTimeout(()=>window.location.href="../../login.html",800); });
const menuToggle = document.getElementById("menuToggle"), sidebar = document.getElementById("sidebar");
if(menuToggle){
  menuToggle.addEventListener("click",()=>sidebar.classList.toggle("active"));
  document.addEventListener("click",(event)=>{ if(sidebar.classList.contains("active") && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) sidebar.classList.remove("active"); });
}