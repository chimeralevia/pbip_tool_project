import { create } from "zustand";

const transform_data = (model) => {
  const tables = model?.model?.tables || [];

  const all_tables = [];
  const all_columns = [];
  const all_measures = [];

  tables.forEach((table) => {
    const t_name = table.name;
    const t_obj = {
      name: t_name,
      entity_type: "TABLE",
      uuid: `[T]${t_name}`,
    };

    const columns = table?.columns || [];
    const t_columns = columns.map((col) => {
      const c_col = structuredClone(col);
      c_col.parent_table = t_obj;
      c_col.entity_type = "COLUMN";
      c_col.uuid = `${t_obj.uuid}[C]${col.name}`;
      return c_col;
    });
    all_columns.push(...t_columns);

    const measures = table?.measures || [];
    const t_measures = measures.map((measure) => {
      const c_mes = structuredClone(measure);
      c_mes.parent_table = t_obj;
      c_mes.entity_type = "MEASURE";
      c_mes.uuid = `${t_obj.uuid}[M]${measure.name}`;
      return c_mes;
    });
    all_measures.push(...t_measures);

    t_obj.columns = t_columns;
    t_obj.measures = t_measures;
    all_tables.push(t_obj);
  });

  const relationships = model?.model?.relationships || [];

  return {
    tables: all_tables,
    columns: all_columns,
    measures: all_measures,
    relationships: relationships,
  };
};

export const useModelStore = create((set) => ({
  modelObj: {},
  model_content: {},
  highlightNodes: [],
  setModelObj: (model) => {
    const trans_model = transform_data(model);
    set({ model_content: trans_model });
    set({ modelObj: model });
  },
  setHighlightNodes: (nodes) => set({ highlightNodes: nodes }),
}));
