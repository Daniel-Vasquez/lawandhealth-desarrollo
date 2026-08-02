import { useId, useMemo, useState } from 'react';

type FormData = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  sector: string;
  subSector: string;
  need: string;
  description: string;
  urgency: string;
  status: string;
};

const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  company: '',
  position: '',
  email: '',
  phone: '',
  sector: '',
  subSector: '',
  need: '',
  description: '',
  urgency: '',
  status: '',
};

const SECTOR_OPTIONS = ['Sector Salud', 'Sector Alimenticio'];

const HEALTH_SUBSECTORS = [
  'Hospital',
  'Clínica',
  'Consultorio',
  'Laboratorio',
  'Farmacia',
  'Distribuidor de medicamentos',
  'Dispositivos médicos',
  'Servicios de diagnóstico',
];

const FOOD_SUBSECTORS = [
  'Fabricante',
  'Productor',
  'Comercializador',
  'Restaurante',
  'Empresa de bebidas',
  'Suplementos alimenticios',
  'Otro',
];

const NEED_OPTIONS = [
  'Trámite o autorización ante COFEPRIS',
  'Verificación sanitaria',
  'Cumplimiento de NOM',
  'Licencia Sanitaria',
  'Aviso de Funcionamiento',
  'Publicidad Sanitaria',
  'Responsable Sanitario',
  'Regularización',
  'Procedimiento administrativo',
  'Otro',
];

const URGENCY_OPTIONS = [
  'Atención inmediata',
  'Durante este mes',
  'Próximos tres meses',
  'Proyecto en planeación',
];

const STATUS_OPTIONS = ['En operación', 'En proceso de apertura', 'Proyecto nuevo'];

const WHATSAPP_NUMBER = '525530756248';

const fieldClasses =
  'w-full border border-black/15 px-3 py-2 text-sm text-black placeholder-black/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary';
const labelClasses = 'block text-xs font-semibold text-black/70 mb-1';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

function TextField({ id, label, value, onChange, type = 'text', placeholder }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldClasses}
      />
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClasses} bg-white`}>
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

interface EvaluationFormProps {
  onClose?: () => void;
}

export default function EvaluationForm({ onClose }: EvaluationFormProps) {
  const uid = useId();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'sector') next.subSector = '';
      return next;
    });
  };

  const subSectorOptions =
    formData.sector === 'Sector Salud'
      ? HEALTH_SUBSECTORS
      : formData.sector === 'Sector Alimenticio'
        ? FOOD_SUBSECTORS
        : [];

  const isStep1Valid = useMemo(
    () =>
      formData.fullName.trim() !== '' &&
      formData.company.trim() !== '' &&
      formData.position.trim() !== '' &&
      isValidEmail(formData.email.trim()) &&
      formData.phone.trim() !== '',
    [formData],
  );

  const isStep2Valid = useMemo(
    () => formData.sector.trim() !== '' && formData.subSector.trim() !== '' && formData.need.trim() !== '',
    [formData],
  );

  const isStep3Valid = useMemo(
    () => formData.description.trim() !== '' && formData.urgency.trim() !== '' && formData.status.trim() !== '',
    [formData],
  );

  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid;

  const canAdvance = currentStep === 1 ? isStep1Valid : currentStep === 2 ? isStep2Valid : isStep3Valid;

  const buildWhatsAppMessage = () =>
    [
      'Solicitud de evaluación regulatoria',
      '',
      'Datos de contacto',
      `Nombre completo: ${formData.fullName}`,
      `Empresa: ${formData.company}`,
      `Cargo: ${formData.position}`,
      `Correo empresarial: ${formData.email}`,
      `Teléfono: ${formData.phone}`,
      '',
      'Sector y necesidad',
      `Sector: ${formData.sector}`,
      `Giro específico: ${formData.subSector}`,
      `Necesidad: ${formData.need}`,
      '',
      'Contexto y urgencia',
      `Situación: ${formData.description}`,
      `Urgencia: ${formData.urgency}`,
      `Estado actual de la empresa: ${formData.status}`,
    ].join('\n');

  const handleSubmit = () => {
    if (!isFormValid) return;
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-white shadow-2xl text-left">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-brand-primary leading-tight">
              Solicita una evaluación regulatoria
            </h2>
            <p className="text-xs text-black/60 mt-1.5 leading-relaxed">
              Comparte la información de tu empresa. Revisaremos tu caso para identificar la mejor estrategia antes
              del primer contacto.
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar formulario"
              className="flex-shrink-0 text-black/40 hover:text-black transition-colors duration-200 text-xl leading-none"
            >
              &times;
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <span key={step} className={`h-1 flex-1 ${step <= currentStep ? 'bg-brand-secondary' : 'bg-black/10'}`} />
          ))}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40 mt-1.5">
          Paso {currentStep} de 3
        </p>

        <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && (
            <div className="space-y-3">
              <TextField
                id={`${uid}-fullName`}
                label="Nombre completo"
                value={formData.fullName}
                onChange={(v) => updateField('fullName', v)}
                placeholder="Tu nombre completo"
              />
              <TextField
                id={`${uid}-company`}
                label="Empresa"
                value={formData.company}
                onChange={(v) => updateField('company', v)}
                placeholder="Nombre de tu empresa"
              />
              <TextField
                id={`${uid}-position`}
                label="Cargo"
                value={formData.position}
                onChange={(v) => updateField('position', v)}
                placeholder="Tu cargo en la empresa"
              />
              <TextField
                id={`${uid}-email`}
                label="Correo empresarial"
                type="email"
                value={formData.email}
                onChange={(v) => updateField('email', v)}
                placeholder="nombre@empresa.com"
              />
              <TextField
                id={`${uid}-phone`}
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(v) => updateField('phone', v)}
                placeholder="10 dígitos"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <SelectField
                id={`${uid}-sector`}
                label="¿A qué sector pertenece tu empresa?"
                value={formData.sector}
                onChange={(v) => updateField('sector', v)}
                options={SECTOR_OPTIONS}
              />
              {subSectorOptions.length > 0 && (
                <SelectField
                  id={`${uid}-subSector`}
                  label="Especifica el giro"
                  value={formData.subSector}
                  onChange={(v) => updateField('subSector', v)}
                  options={subSectorOptions}
                />
              )}
              <SelectField
                id={`${uid}-need`}
                label="¿Qué necesitas resolver?"
                value={formData.need}
                onChange={(v) => updateField('need', v)}
                options={NEED_OPTIONS}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <div>
                <label htmlFor={`${uid}-description`} className={labelClasses}>
                  Describe brevemente tu situación
                </label>
                <textarea
                  id={`${uid}-description`}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Cuéntanos el contexto de tu empresa o el problema que necesitas resolver."
                  rows={4}
                  className={`${fieldClasses} resize-none`}
                />
              </div>
              <SelectField
                id={`${uid}-urgency`}
                label="Nivel de urgencia"
                value={formData.urgency}
                onChange={(v) => updateField('urgency', v)}
                options={URGENCY_OPTIONS}
              />
              <SelectField
                id={`${uid}-status`}
                label="Estado actual de la empresa"
                value={formData.status}
                onChange={(v) => updateField('status', v)}
                options={STATUS_OPTIONS}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-black/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((step) => step - 1)}
                className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors duration-200"
              >
                Atrás
              </button>
            ) : (
              <span />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => canAdvance && setCurrentStep((step) => step + 1)}
                disabled={!canAdvance}
                className={`inline-flex items-center gap-2 bg-brand-primary text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 transition-opacity duration-200 ${canAdvance ? 'opacity-100 cursor-pointer hover:bg-brand-primary-light' : 'opacity-40 cursor-not-allowed'
                  }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`inline-flex items-center gap-2 bg-brand-secondary text-black text-xs font-black uppercase tracking-widest px-5 py-3 transition-opacity duration-200 ${isFormValid ? 'opacity-100 cursor-pointer hover:bg-white' : 'opacity-40 cursor-not-allowed'
                  }`}
              >
                Iniciar conversación
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
