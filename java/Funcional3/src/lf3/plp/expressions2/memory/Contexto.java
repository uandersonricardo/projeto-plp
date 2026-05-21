package lf3.plp.expressions2.memory;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import lf3.plp.expressions2.expression.Id;

/**
 * Classe abstrata que representa um contexto
 * 
 * @author eagt
 * 
 */
public class Contexto<T> {
	/**
	 * A pilhaValor de blocos de contexto.
	 */
	protected Stack<HashMap<Id, T>> pilha;

	/**
	 * Snapshots of each scope created during type checking, in declaration order.
	 */
	protected List<HashMap<Id, T>> pilhaSnapshot;

	/**
	 * Construtor da classe.
	 */
	public Contexto() {
		pilha = new Stack<HashMap<Id, T>>();
		pilhaSnapshot = new ArrayList<HashMap<Id, T>>();
	}

	public void incrementa() {
		HashMap<Id, T> novoFrame = new HashMap<Id, T>();
		pilha.push(novoFrame);
		pilhaSnapshot.add(novoFrame);
	}

	public void restaura() {
		pilha.pop();
	}

	/**
	 * Mapeia o id no valor dado.
	 * 
	 * @exception VariavelJaDeclaradaException
	 *                se j� existir um mapeamento do identificador nesta tabela.
	 */
	public void map(Id idArg, T valorId) throws VariavelJaDeclaradaException {
		try {
			HashMap<Id, T> aux = pilha.peek();
			if (aux.put(idArg, valorId) != null)
				throw new IdentificadorJaDeclaradoException();
		} catch (IdentificadorJaDeclaradoException e) {
			throw new VariavelJaDeclaradaException(idArg);
		}
	}

	/**
	 * Retorna o valor mapeado ao id dado.
	 * 
	 * @exception VariavelNaoDeclaradaException
	 *                se n�o existir nenhum valor mapeado ao id dado nesta
	 *                tabela.
	 */
	public T get(Id idArg) throws VariavelNaoDeclaradaException {
		try {
			T result = null;
			Stack<HashMap<Id, T>> auxStack = new Stack<HashMap<Id, T>>();
			while (result == null && !pilha.empty()) {
				HashMap<Id, T> aux = pilha.pop();
				auxStack.push(aux);
				result = aux.get(idArg);
			}
			while (!auxStack.empty()) {
				pilha.push(auxStack.pop());
			}
			if (result == null)
				throw new IdentificadorNaoDeclaradoException();

			return result;
		} catch (IdentificadorNaoDeclaradoException e) {
			throw new VariavelNaoDeclaradaException(idArg);
		}
	}

	/**
	 * Returns the pilhaValor.
	 * 
	 * @return Stack
	 */
	protected Stack<HashMap<Id, T>> getPilha() {
		return pilha;
	}

	/**
	 * Sets the pilhaValor.
	 * 
	 * @param pilha
	 *            The pilhaValor to set
	 */
	protected void setPilha(Stack<HashMap<Id, T>> pilha) {
		this.pilha = pilha;
	}

	/**
	 * Returns a serializable snapshot of declared identifiers mapped to their values.
	 * Keys and values are converted to String via toString() to make JSON serialization
	 * straightforward for the web API.
	 */
	public List<java.util.Map<String,String>> getPilhaSnapshot() {
		List<java.util.Map<String,String>> snapshot = new ArrayList<java.util.Map<String,String>>();
		if (pilhaSnapshot != null) {
			for (HashMap<Id, T> frame : pilhaSnapshot) {
				java.util.HashMap<String,String> frameSnapshot = new java.util.HashMap<String,String>();
				for (java.util.Map.Entry<Id, T> e : frame.entrySet()) {
					String k = e.getKey() == null ? "null" : e.getKey().toString();
					String v = e.getValue() == null ? "null" : e.getValue().toString();
					frameSnapshot.put(k, v);
				}
				snapshot.add(frameSnapshot);
			}
		}
		return snapshot;
	}

	/*
	public Contexto<Valor> clone(){
		Contexto<Valor> retorno = new Contexto<Valor>();
		
		Stack<HashMap<Id, Valor>> novaPilha = new Stack<HashMap<Id, Valor>>();
		
		for (HashMap<Id, T> map : this.pilha){
			HashMap<Id, Valor> novoMap = new HashMap<Id, Valor>();
			
			for(Entry<Id, T> entry : map.entrySet()){
				novoMap.put(entry.getKey().clone(),
						((Valor) entry.getValue()).clone());
			}
			
			novaPilha.add(novoMap);
		}
		
		return retorno;
	}*/
}
