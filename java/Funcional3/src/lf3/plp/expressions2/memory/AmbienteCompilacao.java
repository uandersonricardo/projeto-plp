package lf3.plp.expressions2.memory;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import lf3.plp.expressions1.util.Tipo;


public interface AmbienteCompilacao extends Ambiente<Tipo> {

	void incrementa(SourceRange sourceRange);

	default List<Map<String,Object>> getPilhaSnapshot() {
		return Collections.emptyList();
	}

}
