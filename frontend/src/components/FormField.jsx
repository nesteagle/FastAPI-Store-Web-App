export default function FormField({ label, id, type, name, value, onChange, required = false, ...rest }) {
    return(
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                {...rest}
            />
        </div>
    );
}